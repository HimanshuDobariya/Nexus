import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, config.jwt_secret, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
