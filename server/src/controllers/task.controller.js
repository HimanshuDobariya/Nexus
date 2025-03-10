import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import { checkPermission } from "../services/checkPermission.js";
import { Permissions } from "../enums/role.enum.js";
import Member from "../models/members.model.js";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum.js";

// create task
export const createTask = async (req, res) => {
  try {
    const { userId } = req;
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      projectId,
    } = req.body;
    const { workspaceId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.CREATE_TASK]);

    const project = await Project.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      return res.status(404).json({
        message: "Project not found or does not belong to this workspace",
      });
    }

    if (assignedTo) {
      const isAssignedUserMember = await Member.exists({
        userId: assignedTo,
        workspaceId,
      });
      if (!isAssignedUserMember) {
        return res.status(400).json({
          message: "Assigned user is not a member of this workspace.",
        });
      }
    }

    const task = new Task({
      title,
      description,
      priority: priority || TaskPriorityEnum.MEDIUM,
      status: status || TaskStatusEnum.TODO,
      createdBy: userId,
      workspace: workspaceId,
      project: projectId,
      assignedTo,
      dueDate,
    });

    await task.save();

    res.status(200).json({ message: "Task created successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Server error.",
    });
  }
};

// get all task
export const getAllTasks = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId } = req.params;

    const filters = {
      projectId: req.query.projectId || undefined,
      status: req.query.status ? req.query.status?.split(",") : undefined,
      priority: req.query.priority ? req.query.priority?.split(",") : undefined,
      assignedTo: req.query.assignedTo
        ? req.query.assignedTo?.split(",")
        : undefined,
      keyword: req.query.keyword || undefined,
      dueDate: req.query.dueDate || undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize) || 10,
      pageNumber: parseInt(req.query.pageNumber) || 1,
    };

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.VIEW_ONLY]);

    const query = {
      workspace: workspaceId,
    };

    if (filters.projectId) {
      query.project = filters.projectId;
    }
    if (filters.status && filters?.status.length > 0) {
      query.status = { $in: filters.status };
    }

    if (filters.priority && filters.priority?.length > 0) {
      query.priority = { $in: filters.priority };
    }

    if (filters.assignedTo && filters.assignedTo?.length > 0) {
      query.assignedTo = { $in: filters.assignedTo };
    }

    if (filters.keyword) {
      query.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.dueDate) {
      query.dueDate = {
        $eq: new Date(filters.dueDate),
      };
    }

    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("project")
        .populate("assignedTo"),
      Task.countDocuments(query),
    ]);
    res.status(200).json({ tasks, totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Server error.",
    });
  }
};

// get task by id
export const getTaskById = async (req, res) => {
  try {
    const { userId } = req;
    const { id: taskId, workspaceId, projectId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    checkPermission(role, [Permissions.VIEW_ONLY]);

    const project = await Project.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      return res.status(404).json({
        message: "Project not found or does not belong to this workspace",
      });
    }

    const task = await Task.findOne({
      _id: taskId,
      workspace: workspaceId,
      project: projectId,
    });

    if (!task || task.project.toString() !== projectId.toString()) {
      return res.status(404).json({
        message: "Task not found or does not belong to this project",
      });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Server error.",
    });
  }
};

// update task
export const updateTask = async (req, res) => {
  try {
    const { userId } = req;
    const { projectId, workspaceId, id: taskId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.EDIT_TASK]);

    const project = await Project.findById(projectId);

    if (!project || project.workspace.toString() !== workspaceId.toString()) {
      return res.status(404).json({
        message: "Project not found or does not belong to this workspace",
      });
    }

    const task = await Task.findById(taskId);

    if (!task || task.project.toString() !== projectId.toString()) {
      return res.status(404).json({
        message: "Task not found or does not belong to this project",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { project: req.body.projectId, ...req.body },
      { new: true }
    );

    if (!updatedTask) {
      return req.status(400).json({
        message: "Failed to update task",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: error.message || "Server error.",
    });
  }
};

export const deleteTaskTask = async (req, res) => {
  try {
    const { userId } = req;
    const { id: taskId, workspaceId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.DELETE_TASK]);
    const task = await Task.findOneAndDelete({
      _id: taskId,
      workspace: workspaceId,
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found or does not belong to the specified workspace",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Server error.",
    });
  }
};
