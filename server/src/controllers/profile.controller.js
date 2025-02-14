import Profile from "../models/profile.model.js";
import cloudinary from "../config/cloudinary.config.js";

export const updateProfileData = async (req, res) => {
  try {
    const { ...updateFields } = req.body;
    const userId = req.userId

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    Object.keys(updateFields).forEach((field) => {
      if (updateFields[field] !== undefined) {
        profile[field] = updateFields[field];
      }
    });

    if (req.file) {
      const fileSize = req.file.size; // File size in bytes

      // Convert bytes to MB (1MB = 1024 * 1024 bytes)
      if (fileSize > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size exceeds 5MB limit." });
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      profile.profileImage = result.secure_url;
    }

    await profile.save();

    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export const getProfileData = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found.", userId });
    }
    res.status(200).json({ profile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};
