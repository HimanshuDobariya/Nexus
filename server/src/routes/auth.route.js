import express from "express";
import { signup, login, verifyEmail } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

export default router;
