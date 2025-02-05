import crypto from "crypto";

export const generateOTP = () => {
  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};
