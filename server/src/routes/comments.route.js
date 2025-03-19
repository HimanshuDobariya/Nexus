import express from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/:taskId/create", createComment);
router.get("/:taskId", getAllComments);
router.put("/:commentId/update", updateComment);
router.delete("/:commentId/delete", deleteComment);
export default router;
