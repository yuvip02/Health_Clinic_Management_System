import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name Must contain atlast 3 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name Must contain atlast 3 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Must be a valid mail"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone must contain exact 10 digits"],
    maxLength: [10, "Phone must contain exact 10 digits"],
  },
  message: {
    type: String,
    required: true,
    minLength: [5, "Message too small"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
