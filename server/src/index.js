import express from "express";
import { config } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// middleware
app.use(
  cors({
    origin: config.client_url,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// connect to database
connectDatabase();

//routes
app.use("/api/auth", authRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
