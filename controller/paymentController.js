import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Payment } from "../models/paymentSchema.js";
import { Appointment } from "../models/appointmentSchema.js"; // Import the Appointment model
import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  try {
    const user = req.user;
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      user,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getkey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
    success: true,
  });
});

export const paymentVerification = async (req, res, next) => {
  const user = req.user;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId: user._id,
    });

    // Update the payment status of the appointment
    await Appointment.findByIdAndUpdate(appointmentId, { payment_status: 1 });

    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
