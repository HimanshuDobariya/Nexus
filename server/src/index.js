import express from "express";
import { config } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";

const app = express();

// connect to database
connectDatabase();

app.listen(config.port, () => {
  console.log(`Server running on port : ${config.port}`);
});
