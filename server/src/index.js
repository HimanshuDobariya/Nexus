import express from "express";
import { config } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

// middleware
app.use(express.json());

// connect to database
connectDatabase();

//routes
app.use("/api/auth", authRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
