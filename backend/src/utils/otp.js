import bcrypt from "bcryptjs";

function generateOtpFallback() {
  let otp = "";
  while (otp.length < 6) {
    const randomBits = Math.floor(Math.random() * 1000000); // Generate random number between 0 and 999999
    otp = randomBits.toString().padStart(6, "0"); // Ensure 6 digits
  }
  return otp;
}

// Generate a true random OTP using crypto.getRandomValues() if available, else fallback to generateOtpFallback()
export function generateOtp() {
  try {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);
    const randomBits = (array[0] << 16) | (array[1] << 8) | array[2];
    return (randomBits % 1000000).toString().padStart(6, "0");
  } catch (error) {
    // Fallback to generating OTP using Math.random() if crypto.getRandomValues() is not available or throws an error
    return generateOtpFallback();
  }
}

export const hashOtp = (plain) => {
  return bcrypt.hash(plain, 11);
};

export const compareOtp = (plain, hash) => {
  return bcrypt.compare(plain, hash);
};