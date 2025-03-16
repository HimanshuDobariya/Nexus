import mongoose from "mongoose";
import { generateTaskCode } from "../utils/uuid.js";
import { TaskStatusEnum, TaskPriorityEnum } from "../enums/task.enum.js";

const TaskScheme = new mongoose.Schema(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      required: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriorityEnum),
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    position: { type: Number, required: true, min: 1000, max: 1000000 },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskScheme);

export default Task;
