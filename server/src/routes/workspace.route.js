import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from "../controllers/workspaces.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createWorkspace);
router.get("/", getWorkspaces);
router.get("/:id", getWorkspaceById);
router.put("/:id", upload.single("image"), updateWorkspace);
router.delete("/:id", deleteWorkspace);

export default router;
