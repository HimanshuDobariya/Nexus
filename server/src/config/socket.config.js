import { Server } from "socket.io";
import { config } from "./env.config.js";
import { getDueTasksNotifications } from "../services/getDueTasksNotifications.js";

let io;
const connectedUsers = new Set(); // Track connected users

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.client_url,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("user-connected", async ({ userId, workspaceId }) => {
      if (!userId || !workspaceId) return;

      if (!connectedUsers.has(userId)) {
        connectedUsers.add(userId);
        socket.join(userId);
        socket.userId = userId;

        try {
          await getDueTasksNotifications(userId, workspaceId, io);
        } catch (err) {
          console.error(
            `getDueTasksNotifications failed for user ${userId}:`,
            err.message
          );
        }
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
    });
  });

  return io;
};

export { initializeSocket, io };
