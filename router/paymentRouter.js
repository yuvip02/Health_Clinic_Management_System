import express from "express"

import { checkout, getkey, paymentVerification } from "../controller/paymentController.js"
import { isAdminAuthenticated ,isPatientAuthenticated} from "../middleware/auth.js"

const router=express.Router()

router.get("/getkey",getkey)
router.post("/checkout",isPatientAuthenticated,checkout)
router.post("/paymentverification",isPatientAuthenticated,paymentVerification)


export default router