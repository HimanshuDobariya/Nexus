import express from "express";
import {
  inviteMemberToWorkspace,
  joinWorkspace,
  rejectIvitation,
} from "../controllers/member.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post(
  "/workspace/:inviteCode/invite",
  verifyToken,
  inviteMemberToWorkspace
);
router.post(
  "/workspace/:inviteCode/join/:invitationId",
  verifyToken,
  joinWorkspace
);
router.post("/reject/:invitationId", rejectIvitation);

export default router;
