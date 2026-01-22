import { Router } from "express";
import { register, verifyOtp, resendOtp, login } from "../controllers/auth.controller.js";

const router = Router();

// Authentication routes
router.post("/register", register);

// OTPs
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

//Login
router.post("/login", login);

export default router;
