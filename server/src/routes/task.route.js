import express from "express";
import {
  createTask,
  deleteTaskTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTasksBulk,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/project/:projectId/workspace/:workspaceId/create", createTask);
router.get("/workspace/:workspaceId/all", getAllTasks);
router.get("/:id/project/:projectId/workspace/:workspaceId", getTaskById);
router.put("/:id/project/:projectId/workspace/:workspaceId/update", updateTask);
router.patch("/workspace/:workspaceId/bulk-update", updateTasksBulk);
router.delete("/:id/workspace/:workspaceId/delete", deleteTaskTask);

export default router;
