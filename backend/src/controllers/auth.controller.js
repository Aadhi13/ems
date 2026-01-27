import userData from "../models/user.model.js";
import userOtpData from "../models/otp.model.js";
import { hashPassword, comparePassword, createToken } from "../utils/auth.js";
import { verificationMail, welcomeMail } from "../utils/mail.js";
import { compareOtp, generateOtp, hashOtp } from "../utils/otp.js";

export const register = async (req, res, next) => {
  try {
    //TODO: handle error when invalid values(invalid syntax) are coming

    const { name, email, password } = req.body;

    // Basic checks
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Name, Email and password are required." });
    }

    //TODO: Check regex on password and email

    const existing = await userData.findOne({ email });
    const isVerified = existing?.isVerified ?? false;
    if (existing && isVerified) {
      return res
        .status(409)
        .json({ error: "Email already in use. Try login." });
    } else if (existing && !isVerified) {
      return res
        .status(409)
        .json({ error: "Email already in use. Verify to login." });
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

    // Send email after generating OTP
    try {
      await verificationMail(user.name, user.email, otp);
    } catch (mailErr) {
      console.error("Error sending verification email", mailErr);
      return res
        .status(500)
        .json({ message: "Something went wrong. Contact developer for help." });
    }

    await welcomeMail(user.name, user.email);

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
    await userData.updateOne({ _id: userDetails._id }, { isVerified: true });

    // mark ONLY the matched OTP as used (others remain valid until user verified, but won't matter after)
    await userOtpData.updateOne({ _id: matchedDoc._id }, { used: true });

    //TODO: Send a verification successfull email to user

    return res
      .status(200)
      .json({ message: "OTP is correct, email is verified." });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body ?? "";
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userDetails = await userData.findOne({ email });
    if (!userDetails) {
      return res.status(400).json({
        message: "User not found. Register first then request OTP to verify.",
      });
    }

    if (userDetails.isVerified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    // Generate otp
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    // Create OTP record in DB
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    const newOtp = await userOtpData.create({
      user: userDetails._id,
      email,
      otpHash,
      expiresAt,
    });

    // Send email after generating OTP
    try {
      await verificationMail(userDetails.name, userDetails.email, otp);
    } catch (mailErr) {
      console.error("Error sending verification email", mailErr);
      return res
        .status(500)
        .json({ message: "Something went wrong. Contact developer for help." });
    }
    return res.status(201).json({
      message: "Please verify using OTP sent to your email.",
      expiresAt,
      email: userDetails.email,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const userDetails = await userData.findOne({ email });
    if (userDetails) {
      const match = await comparePassword(password, userDetails.passwordHash);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (userDetails.isVerified == false) {
        try {
          // Generate otp
          const otp = generateOtp();
          const otpHash = await hashOtp(otp);

          // Create OTP record in DB
          const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
          const newOtp = await userOtpData.create({
            user: userDetails._id,
            email,
            otpHash,
            expiresAt,
          });

          // Send email after generating OTP
          try {
            await verificationMail(userDetails.name, userDetails.email, otp);
          } catch (mailErr) {
            console.error("Error sending verification email", mailErr);
            return res.status(500).json({
              message: "Something went wrong. Contact developer for help.",
            });
          }

          return res.status(201).json({
            message: "Please verify using OTP sent to your email.",
            expiresAt,
            email: userDetails.email,
          });
        } catch (err) {
          return res.status(500).json({ message: "Something went wrong." });
        }
      }
      if (match) {
        const accessToken = createToken(userDetails._id);
        return res
          .status(201)
          .json({ message: "Authentication successfull.", accessToken });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
};
