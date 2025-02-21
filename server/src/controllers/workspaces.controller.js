import Workspace from "../models/workspace.model.js";
import cloudinary from "../config/cloudinary.config.js";

//create workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const isWorkspaceExist = await Workspace.findOne({ name, owner: userId });
    if (isWorkspaceExist) {
      return res.status(404).json({ message: "Workspace already exist." });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; // Store the Cloudinary URL
    }

    const newWorkspace = new Workspace({
      name,
      owner: userId,
      imageUrl,
    });

    await newWorkspace.save();
    res.status(201).json({ workspace: newWorkspace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all workspace
export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.userId;
    const workspaces = await Workspace.find({ owner: userId });
    res.status(200).json({ workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get single workspace
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    let workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; // Store the Cloudinary URL
    }

    workspace.name = name || workspace.name;
    workspace.imageUrl = imageUrl || workspace.imageUrl;

    await workspace.save();
    res.status(200).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
