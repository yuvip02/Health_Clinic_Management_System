import express from "express";
import {
  addNewDoctor,
  adminLogout,
  adminRegister,
  getAllDetails,
  getAllDoctors,
  login,
  patientLogout,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);

router.post("/admin/addnew", isAdminAuthenticated, adminRegister);
router.get("/admin/logout", isAdminAuthenticated, adminLogout);

router.get("/patient/logout", isPatientAuthenticated, patientLogout);
router.get("/doctors", getAllDoctors);
router.post("/doctors/addnew", isAdminAuthenticated, addNewDoctor);

router.get("/admin/me", isAdminAuthenticated, getAllDetails);
router.get("/patient/me", isPatientAuthenticated, getAllDetails);

router.get("/checkAuth", isPatientAuthenticated, (req, res) => {
  res.status(200).json({ isAuthenticated: true, user: req.user });
});

export default router;
