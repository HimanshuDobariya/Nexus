import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dbUri: process.env.DB_URI,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  jwt_secret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV,
};
