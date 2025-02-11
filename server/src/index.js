import express from "express";
import { config } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import profileRoutes from "./routes/profile.route.js";

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

// connect to database
connectDatabase();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
