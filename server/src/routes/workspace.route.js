import express from "express";
import {
  createWorkspace,
  getWorkspaces,
} from "../controllers/workspaces.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createWorkspace);
router.get("/", getWorkspaces);

export default router;
