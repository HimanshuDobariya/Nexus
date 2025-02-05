import nodemailer from "nodemailer";
import { config } from "./env.config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});
