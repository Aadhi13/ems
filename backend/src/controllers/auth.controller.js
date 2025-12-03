import userData from "../models/user.model.js";
import userOtpData from "../models/otp.model.js";
import { hashPassword } from "../utils/auth.js";
import { verificationMail } from "../utils/mail.js";
import { compareOtp, generateOtp, hashOtp } from "../utils/otp.js";

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

export const verifyOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }

    const userDetails = await userData.findOne({ email });
    if (!userDetails) {
      return res.status(400).json({ message: "User not found" });
    }

    if (userDetails.isVerified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    // find ALL active OTPs (unexpired + unused) for this user/email
    const now = new Date();
    const otpDocs = await userOtpData
      .find({
        email,
        user: userDetails._id,
        used: false,
        expiresAt: { $gt: now },
      })
      .sort({ createdAt: -1 });

    if (!otpDocs.length) {
      return res.status(400).json({
        message: "No active OTP found for this email. Try resending OTP.",
      });
    }

    // try match against ANY active OTP
    let matchedDoc = null;
    for (const doc of otpDocs) {
      const ok = await compareOtp(otp, doc.otpHash);
      if (ok) {
        matchedDoc = doc;
        break;
      }
    }

    if (!matchedDoc) {
      return res.status(401).json({ message: "OTP is not correct." });
    }

    // mark user verified
    await userData.updateOne(
      { _id: userDetails._id },
      { isVerified: true }
    );

    // mark ONLY the matched OTP as used (others remain valid until user verified, but won't matter after)
    await userOtpData.updateOne(
      { _id: matchedDoc._id },
      { used: true }
    );

    return res
      .status(200)
      .json({ message: "OTP is correct, email verified." });
  } catch (err) {
    next(err);
  }
};
