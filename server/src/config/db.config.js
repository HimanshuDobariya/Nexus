import mongoose from "mongoose";
import { config } from "./env.config.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.dbUri);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database");
    process.exit(1);
  }
};

export default connectDatabase;
