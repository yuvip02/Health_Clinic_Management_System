import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getUserAppointments,
} from "../controller/appointmentController.js";
import {
  isPatientAuthenticated,
  isAdminAuthenticated,
} from "../middleware/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/getuserappointment", isPatientAuthenticated, getUserAppointments);

router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.get("/:id", isAdminAuthenticated, getAppointmentById);


router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;
