import express from "express";
import {
  deleteNotification,
  readNotification,
  readAllNotifications,
} from "../controllers/notifications.controller.js";
const router = express.Router();

router.patch("/:id/read", readNotification);
router.patch("/user/:userId/read-all", readAllNotifications);
router.patch("/:id", deleteNotification);

export default router;
