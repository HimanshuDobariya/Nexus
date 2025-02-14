import express from "express";
import {
  getProfileData,
  updateProfileData,
} from "../controllers/profile.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/", verifyToken, getProfileData);
router.put("/", verifyToken, upload.single("image"), updateProfileData);

export default router;
