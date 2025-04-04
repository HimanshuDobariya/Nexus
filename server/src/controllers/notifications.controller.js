import Notification from "../models/notifications.model.js";

export const readNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const readAllNotifications = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read", result });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the notification and ensure it exists before updating
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.isDeleted) {
      return res
        .status(400)
        .json({ message: "Notification is already deleted" });
    }

    notification.isDeleted = true;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification marked as deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};
