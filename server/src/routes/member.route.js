import express from "express";
import { joinWorkspace } from "../controllers/member.controller.js";
const router = express.Router();

router.post("/workspace/:inviteCode/join", joinWorkspace);

export default router;
