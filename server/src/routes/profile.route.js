import express from "express";
import {
  getProfileData,
  updateProfileData,
} from "../controllers/profile.controller.js";

import upload  from "../middlewares/multer.js";

const router = express.Router();

router.get("/:userId", getProfileData);
router.put("/", upload.single("image"), updateProfileData);

export default router;
