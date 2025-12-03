import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const hashPassword = (plain) => {
  return bcrypt.hash(plain, 11);
};

export const comparePassword = (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

export const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
