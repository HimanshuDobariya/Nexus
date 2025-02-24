import express from "express";
import {
  getWorkspaceMembers,
  addMember,
  updateMemberRole,
  deleteMember,
} from "../controllers/member.controller.js";
const router = express.Router();

router.get("/:workspaceId", getWorkspaceMembers);
router.post("/", addMember);
router.put("/:memberId", updateMemberRole);
router.delete("/:memberId", deleteMember);

export default router;
