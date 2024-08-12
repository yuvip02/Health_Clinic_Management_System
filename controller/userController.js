import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js"; // Ensure this is the correct import
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body); // Log the request body to inspect data received

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role,
    dob,
  } = req.body;

  // Check if any required fields are missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nic ||
    !role ||
    !dob // Ensure dob is included in the check
  ) {
    return next(new ErrorHandler("Please fill the form completely", 400));
  }
  // Check if the user already exists
  let user = await User.findOne({ email: email });
  {
    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role,
    dob,
  });

  // Example: create user logic here
  res
    .status(200)
    .json({ success: true, message: "User registered successfully" });
  generateToken(user, "User Registered", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide all details", 400));
  }
  // if(password!==confirmPassword)
  //     {
  //         return next(new ErrorHandler("Password and Confirm Password does not match",400))
  //     }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found or wrong credentials", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("User not found or wrong credentials", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found", 400));
  }
  generateToken(user, "User Logged in", 200, res);
});

export const adminRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role,
    dob,
  } = req.body;

  // Check if any required fields are missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nic ||
    !dob // Ensure dob is included in the check
  ) {
    return next(new ErrorHandler("Please fill the form completely", 400));
  }
  let user = await User.findOne({ email: email });
  if (user) {
    return next(
      new ErrorHandler(` ${user.role}with this email already exists`, 400)
    );
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role: "Admin",
    dob,
  });
  res.status(200).json({ success: "true", message: "Admin registered" });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  if (!doctors) {
    return next(new ErrorHandler("No doctors found", 400));
  }
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getAllDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  res.status(200).json({
    status: "Success",
    message: "user found",
    user,
  });
});

export const adminLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: "true",
      message: "Admin logged out",
    });
});
export const patientLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: "true",
      message: "Patient logged out",
      user: req.user,
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("No file uploaded. Doctor avatar required", 400)
    );
  }
  const docAvatar = req.files.docAvatar;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("Invalid file format", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role,
    dob,
    doctorDepartment,
  } = req.body;

  // Check if any required fields are missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !nic ||
    !dob ||
    !doctorDepartment // Ensure dob is included in the check
  ) {
    return next(new ErrorHandler("Please fill the form completely", 400));
  }
  // Check if the user already exists
  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler(`${user.role} already exists`, 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinary.error) {
    return next(
      new ErrorHandler("Error uploading file" || cloudinary.error, 500)
    );
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    nic,
    role: "Doctor",
    dob,
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Doctor created successfully",
    doctor,
  });
});
