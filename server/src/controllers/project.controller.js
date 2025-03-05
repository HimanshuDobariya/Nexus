import Project from "../models/project.model.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import { checkPermission } from "../services/checkPermission.js";
import { Permissions } from "../enums/role.enum.js";

export const createProject = async (req, res) => {
  try {
    const { userId } = req;
    const { workspaceId } = req.params;
    const { name, emoji, description } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, userId);
    await checkPermission(role, [Permissions.CREATE_PROJECT]);

    // Create the project
    const newProject = new Project({
      name,
      description,
      emoji,
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

    const projects = await Project.find({ workspace: workspaceId });

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
    const { name, emoji, description } = req.body;

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

    // Update the project fields
    if (emoji) project.emoji = emoji;
    if (name) project.name = name;
    if (description) project.description = description;

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

    res.status(200).json({
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
