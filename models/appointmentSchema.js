import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First Name must contain at least 3 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minLength: [3, "Last Name must contain at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Invalid email format"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [10, "Phone must contain exact 10 digits"],
    maxLength: [10, "Phone must contain exact 10 digits"],
  },
  nic: {
    type: String,
    required: [true, "NIC is required"],
    minLength: [10, "NIC must contain exact 10 digits"],
    maxLength: [10, "NIC must contain exact 10 digits"],
  },
  dob: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female"],
  },
  appointmentDate: {
    type: String,
    required: [true, "Appointment date is required"],
  },
  department: {
    type: String,
    required: [true, "Department is required"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor last name is required"],
    },
  },
  hasVisited: {
    type: Boolean,
    required: [true, "Visit status is required"],
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor ID is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  payment_status: {
    type: Number,
    enum: [0, 1, 2], // 0: not paid // 1: paid // 2: pending
    default: 0,
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
