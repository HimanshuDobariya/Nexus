import { config } from "../config/env.config.js";
import { transporter } from "../config/nodemailer.config.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (name, email, code) => {
  try {
    transporter.sendMail({
      from: { name: "Himanshu Dobariya", address: config.emailUser }, // sender address
      to: email, // list of receivers
      subject: "Verify Your Email", // Subject line
      html: VERIFICATION_EMAIL_TEMPLATE.replace("[user]", name).replace(
        "[verificationCode]",
        code
      ), // html body
    });
  } catch (error) {
    throw new Error(`Error sendig verification code: ${error}`);
  }
};

export const sendPasswordResetEmail = async (name, email, resetUrl) => {
  try {
    transporter.sendMail({
      from: { name: "Himanshu Dobariya", address: config.emailUser }, // sender address
      to: email, // list of receivers
      subject: "Reset Your Password", // Subject line
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetUrl
      ).replace("[user]", name), // html body
    });
  } catch (error) {
    throw new Error(`Error sendig reset password link : ${error}`);
  }
};
