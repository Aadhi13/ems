import { Router } from "express";
import { register, verifyOtp, resendOtp } from "../controllers/auth.controller.js";

const router = Router();

// Authentication routes
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
