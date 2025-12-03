import userData from "../models/user.model.js";
import userOtpData from "../models/otp.model.js";
import { hashPassword } from "../utils/auth.js";
import { verificationMail } from "../utils/mail.js";
import { generateOtp, hashOtp } from "../utils/otp.js";

export const register = async (req, res, next) => {
  try {

    //TODO: handle error when invalid values are coming

    const { name, email, password } = req.body;

    // Basic checks
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    //TODO: Check regex on password and email

    const existing = await userData.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Create user on database
    const passwordHash = await hashPassword(password);

    const user = await userData.create({
      name,
      email,
      passwordHash,
    });

    // Generate otp
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    // Create OTP record in DB
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    const newOtp = await userOtpData.create({
      user: user._id,
      email,
      otpHash,
      expiresAt,
    });

    // Send email after generatign OTP
    try {
      await verificationMail(user, otp);
    } catch (mailErr) {
      console.error("Error sending verification email", mailErr);
      return res.status(500).json({ message: "Something went wrong." });
    }
    return res.status(201).json({
      message: "User created. Please verify OTP sent to your email.",
      expiresAt,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};
