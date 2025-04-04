import Notification from "../models/notifications.model.js";
import Task from "../models/task.model.js";

// Shared helper
const isDueSoon = (date) => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  return (
    due.getTime() === today.getTime() || due.getTime() === tomorrow.getTime()
  );
};

const buildMessage = (task) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const dueDateString = dueDate.toISOString().split("T")[0];
  const todayString = today.toISOString().split("T")[0];

  const type = dueDateString === todayString ? "WARNING" : "INFORMATION";

  const message =
    type === "INFORMATION"
      ? `🔔 Task Due Tomorrow  
Reminder: Your task "${task.title}" (Code: ${task.taskCode}) in the "${task.project.emoji} ${task.project.name}" project is due tomorrow.`
      : `⚠️ Task Due Today  
Alert: Your task "${task.title}" (Code: ${task.taskCode}) in the "${task.project.emoji} ${task.project.name}" project is due today.`;

  return { type, message };
};

// 🟢 Called after creating a task or when user logs in
export const getDueTasksNotifications = async (userId, workspaceId, io) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      assignedTo: userId,
      status: { $ne: "DONE" },
      workspace: workspaceId,
      dueDate: { $gte: today, $lte: tomorrow },
    }).populate("project");

    for (const task of tasks) {
      const { type, message } = buildMessage(task);

      const existing = await Notification.findOne({
        user: userId,
        taskId: task._id,
        workspace: workspaceId,
      });

      if (!existing) {
        await Notification.create({
          user: userId,
          type,
          message,
          taskId: task._id,
          workspace: workspaceId,
          isSent: true,
          isRead: false,
        });
      }
    }

    const notifications = await Notification.find({
      user: userId,
      workspace: workspaceId,
      isSent: true,
      isDeleted: false,
    }).sort({ createdAt: -1 }); // latest first

    io.to(userId.toString()).emit("task-notifications", notifications);
  } catch (error) {
    console.error("❌ Error checking due tasks:", error);
  }
};

export const handleTaskUpdateNotification = async (oldTask, updatedTask, io) => {
  try {
    const oldDueSoon = isDueSoon(oldTask.dueDate);
    const newDueSoon = isDueSoon(updatedTask.dueDate);

    const oldUserId = oldTask.assignedTo.toString();
    const newUserId = updatedTask.assignedTo.toString();
    const taskId = updatedTask._id;
    const workspaceId = updatedTask.workspace.toString();

    if (updatedTask.status === "DONE") {
      await Notification.updateMany({ taskId, isDeleted: false }, { isDeleted: true });

      const remaining = await Notification.find({
        user: oldUserId,
        workspace: workspaceId,
        isDeleted: false,
        isSent: true,
      }).sort({ createdAt: -1 });

      io.to(oldUserId).emit("task-notifications", remaining);
      return;
    }

    if (oldDueSoon && !newDueSoon) {
      await Notification.updateMany({ taskId, isDeleted: false }, { isDeleted: true });

      const remaining = await Notification.find({
        user: newUserId,
        workspace: workspaceId,
        isDeleted: false,
        isSent: true,
      }).sort({ createdAt: -1 });

      io.to(newUserId).emit("task-notifications", remaining);
      return;
    }

    if (oldUserId !== newUserId) {
      await Notification.updateMany({ taskId, user: oldUserId, isDeleted: false }, { isDeleted: true });

      const oldUserNotifications = await Notification.find({
        user: oldUserId,
        workspace: workspaceId,
        isDeleted: false,
        isSent: true,
      }).sort({ createdAt: -1 });

      io.to(oldUserId).emit("task-notifications", oldUserNotifications);
    }

    if (oldDueSoon && newDueSoon && oldTask.dueDate !== updatedTask.dueDate) {
      await Notification.updateMany({ taskId, isDeleted: false }, { isDeleted: true });
    }

    if (newDueSoon) {
      const { type, message } = buildMessage(updatedTask);

      let existing = await Notification.findOne({
        user: newUserId,
        taskId,
        isDeleted: false,
        isSent: true,
      });

      if (!existing) {
        await Notification.create({
          user: newUserId,
          type,
          message,
          taskId,
          workspace: workspaceId,
          isSent: true,
          isRead: false,
        });
      } else if (existing.message !== message) {
        existing.message = message;
        existing.isRead = false;
        await existing.save();
      }

      const updatedList = await Notification.find({
        user: newUserId,
        workspace: workspaceId,
        isDeleted: false,
        isSent: true,
      }).sort({ createdAt: -1 });

      io.to(newUserId).emit("task-notifications", updatedList);
    }
  } catch (error) {
    console.error("❌ Error handling task update notification:", error);
  }
};

export const handleTaskDeletionNotification = async (task, io) => {
  try {
    const userId = task.assignedTo.toString();
    const workspaceId = task.workspace.toString();

    await Notification.deleteMany({ taskId: task._id });

    const updatedNotifications = await Notification.find({
      user: userId,
      workspace: workspaceId,
      isSent: true,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    io.to(userId).emit("task-notifications", updatedNotifications);
  } catch (error) {
    console.error("❌ Error handling task delete notification:", error);
  }
};
