import Workspace from "../models/workspace.model.js";
import cloudinary from "../config/cloudinary.config.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const isWorkspaceExist = await Workspace.findOne({ name, userId });
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
      userId,
      imageUrl,
    });

    await newWorkspace.save();
    res.status(201).json({ workspace: newWorkspace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.userId;
    const workspaces = await Workspace.find({ userId });
    res.status(200).json({ workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};