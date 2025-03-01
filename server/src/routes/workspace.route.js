import express from "express";
import {
  changeMembersRole,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  removeMemberFromWorkspace,
  resetInviteCode,
  updateWorkspace,
} from "../controllers/workspaces.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createWorkspace);
router.get("/", getWorkspaces);
router.put("/:workspaceId", upload.single("image"), updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);
router.put("/:workspaceId/reset-invite", resetInviteCode);
router.get("/:workspaceId/members", getWorkspaceMembers);
router.put("/:workspaceId/members/change/role", changeMembersRole);
router.delete("/:workspaceId/members", removeMemberFromWorkspace);

export default router;
