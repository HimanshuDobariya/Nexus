import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller.js";
const router = express.Router();

router.post("/workspace/:workspaceId/create", createProject);
router.get("/workspace/:workspaceId/all", getAllProjects);
router.get("/:projectId/workspace/:workspaceId", getProjectById);
router.put("/:projectId/workspace/:workspaceId/update", updateProject);
router.delete("/:projectId/workspace/:workspaceId/delete", deleteProject);

export default router;
