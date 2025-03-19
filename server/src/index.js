import express from "express";
import { config } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import profileRoutes from "./routes/profile.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import memberRoutes from "./routes/member.route.js";
import roleRoutes from "./routes/role.route.js";
import commentsRoutes from "./routes/comments.route.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import cron from "node-cron";
import updateExpiredInvitations from "./services/updateExpiredInvitation.js";
const app = express();

// middleware
app.use(
  cors({
    origin: config.client_url,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workspaces", verifyToken, workspaceRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/tasks", verifyToken, taskRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/comments", verifyToken, commentsRoutes);

cron.schedule("0 * * * *", updateExpiredInvitations);

app.listen(config.port, async () => {
  console.log(`Server running on port : ${config.port}`);
  // connect to database
  await connectDatabase();
});
