import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import errorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken; // Extracts cookie named 'adminToken'
  if (!token) {
    return next(new errorHandler("Admin not authenticated", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verifies and decodes the token
  req.user = await User.findById(decoded.id); // Retrieves user by ID from the decoded token
  if (req.user.role !== "Admin") {
    return next(new errorHandler("Non-admin is not authenticated", 403));
  }
  next(); // Proceed to the next middleware or route handler
});


export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken; // Extracts cookie named 'patientToken'
    if (!token) {
      return next(new errorHandler("Patient not authenticated", 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verifies and decodes the token
    req.user = await User.findById(decoded.id); // Retrieves user by ID from the decoded token
    if (req.user.role !== "Patient") {
      return next(new errorHandler("Non-patient is not authenticated", 403));
    }
    next(); // Proceed to the next middleware or route handler
  }
);
