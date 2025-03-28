import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import { checkPermission } from "../services/checkPermission.js";
import { Permissions } from "../enums/role.enum.js";
import Member from "../models/members.model.js";

// create task
export const createTask = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, status, priority, assignedTo, dueDate } =
      req.body;
    const { projectId, workspaceId } = req.params;

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

    const highestPositionTask = await Task.find({
      workspace: workspaceId,
      status: status,
    })
      .sort({ position: -1 })
      .limit(1);

    const newPosition =
      highestPositionTask.length > 0
        ? highestPositionTask[0].position + 1000
        : 1000;

    if (newPosition > 1000000) {
      return res.status(400).json({
        message: "Task position limit exceeded.",
      });
    }

    let nextNumber = 1;
    const lastTask = await Task.findOne({ project: projectId })
      .sort({ createdAt: -1 })
      .select("taskCode");

    if (lastTask && lastTask.taskCode) {
      const match = lastTask.taskCode.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const taskCode = `${project.projectKey}-${nextNumber}`;

    const task = new Task({
      title,
      description,
      priority: priority,
      status: status,
      createdBy: userId,
      workspace: workspaceId,
      project: projectId,
      assignedTo,
      dueDate,
      position: newPosition,
      taskCode,
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
    const { workspaceId, projectId } = req.params;

    const filters = {
      status: req.query.status || undefined,
      priority: req.query.priority || undefined,
      assignedTo:
        req.query.assignedTo === "null"
          ? null
          : req.query.assignedTo || undefined,
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
      project: projectId,
    };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.assignedTo !== undefined) {
      query.assignedTo = filters.assignedTo;
    }

    if (filters.keyword) {
      query.$or = [
        { title: { $regex: filters.keyword, $options: "i" } },
        { taskCode: { $regex: filters.keyword, $options: "i" } },
      ];
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
    })
      .populate("assignedTo", "name")
      .populate("project")
      .exec();

    if (!task || task.project._id.toString() !== projectId.toString()) {
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

export const updateTasksBulk = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId } = req.params;
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "Invalid or empty tasks array." });
    }

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.EDIT_TASK]);

    const bulkUpdates = tasks.map(({ _id, status, position }) => ({
      updateOne: {
        filter: { _id, workspace: workspaceId },
        update: { $set: { status, position } },
      },
    }));

    await Task.bulkWrite(bulkUpdates);

    res.status(200).json({ message: "Tasks updated successfully.", tasks });
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
    const { id: taskId, workspaceId, projectId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.DELETE_TASK]);
    const task = await Task.findOneAndDelete({
      _id: taskId,
      project: projectId,
      workspace: workspaceId,
    });

    if (!task) {
      res.status(404).json({
        message: "Task not found or does not belong to the specified project",
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
