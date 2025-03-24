import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import { checkPermission } from "../services/checkPermission.js";
import { Permissions } from "../enums/role.enum.js";

export const createProject = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId } = req.params;
    const { name, emoji, description, projectKey } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.CREATE_PROJECT]);

    const existingProject = await Project.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      workspace: workspaceId,
    });
    if (existingProject) {
      return res.status(400).json({
        message: "A project with this name already exists in the workspace.",
      });
    }

    const newProject = new Project({
      name,
      projectKey,
      description,
      emoji: emoji || "📊",
      workspace: workspaceId,
      createdBy: userId,
    });

    // Save the project to the database
    await newProject.save();

    res.status(201).json({ project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.VIEW_ONLY]);

    const projects = await Project.find({ workspace: workspaceId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId, projectId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.VIEW_ONLY]);

    const project = await Project.findOne({
      _id: projectId,
      workspace: workspaceId,
    });

    if (!project) {
      return res.status(400).json({
        message:
          "Project not found or does not belong to the specified workspace",
      });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { userId } = req;
    const { projectId, workspaceId } = req.params;
    const { name, emoji, description, projectKey } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.EDIT_PROJECT]);

    const project = await Project.findOne({
      _id: projectId,
      workspace: workspaceId,
    });

    if (!project) {
      return res.status(400).json({
        message:
          "Project not found or does not belong to the specified workspace",
      });
    }

    if (name) {
      const existingProject = await Project.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        workspace: workspaceId,
        _id: { $ne: projectId }, // Exclude the current project
      });
      if (existingProject) {
        return res.status(400).json({
          message: "A project with this name already exists in the workspace.",
        });
      }
      project.name = name;
    }

    // Update the project fields
    if (emoji) project.emoji = emoji;
    if (description) project.description = description;
    if (projectKey) project.projectKey = projectKey;

    // Save the updated project
    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { userId } = req;
    const { projectId, workspaceId } = req.params;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.DELETE_PROJECT]);

    const project = await Project.findOne({
      _id: projectId,
      workspace: workspaceId,
    });

    if (!project) {
      return res.status(400).json({
        message:
          "Project not found or does not belong to the specified workspace",
      });
    }

    await project.deleteOne();

    await Task.deleteMany({ project: projectId });

    res.status(200).json({
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
