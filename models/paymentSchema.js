import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false // Optional if you don't always want to store email
  },
  phone: {
    type: String,
    required: false // Optional if you don't always want to store phone
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // Ensures each payment is linked to a user
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);