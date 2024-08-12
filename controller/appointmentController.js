import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import errorHandler from "../middleware/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointmentDate,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address,
    } = req.body;

    // Check if any required fields are missing
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !appointmentDate ||
      !department ||
      !doctor_firstName ||
      !doctor_lastName ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    // Find the doctor
    const isConflict = await User.find({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Doctor",
      doctorDepartment: department,
    });

    if (isConflict.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (isConflict.length > 1) {
      return res.status(400).json({
        success: false,
        message: "Multiple conflicting doctors found. Please contact support.",
      });
    }

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id; // Ensure req.user._id is available and correct

    // Create appointment
    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointmentDate,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      hasVisited,
      address,
      doctorId,
      patientId,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.code === 11000) {
      // Duplicate entry error
      return res
        .status(400)
        .json({ success: false, message: "Duplicate appointment entry." });
    }
    next(error); // Passes the error to the next error handling middleware
  }
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  if (!appointments) {
    return next(new errorHandler("No appointments", 400));
  }
  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

// appointmentController.js

export const getUserAppointments = async (req, res) => {
  try {
    const userEmail = req.user.email; // Assuming req.user contains the authenticated user's info
    const appointments = await Appointment.find({ email: userEmail }); // Filter appointments by user email

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(errorHandler("Appointment not found", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment status updated!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) {
    return next(new errorHandler("Appointment does not exist", 400));
  }
  res.status(200).json({ status: "true", message: "Appointment deleted" });
});
