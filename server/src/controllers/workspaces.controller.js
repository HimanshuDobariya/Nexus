import Workspace from "../models/workspace.model.js";
import cloudinary from "../config/cloudinary.config.js";
import Member from "../models/members.model.js";
import Role from "../models/roles-permission.model.js";
import Invitation from "../models/invitation.model.js";
import { Permissions, Roles } from "../enums/role.enum.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import { checkPermission } from "../services/checkPermission.js";
import { decrypt } from "../utils/crypto-encryption.js";
import Project from "../models/project.model.js";

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

    const ownerRole = await Role.findOne({ name: Roles.OWNER });

    if (!ownerRole) {
      return res.status(404).json({ message: "Owner role not found" });
    }

    const newWorkspace = new Workspace({
      name,
      owner: userId,
      imageUrl,
    });

    await newWorkspace.save();

    const member = new Member({
      userId,
      workspaceId: newWorkspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });

    await member.save();

    res.status(201).json({
      workspace: {
        ...newWorkspace._doc,
        inviteCode: decrypt(newWorkspace.inviteCode),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// get all workspace that user is a member of it
export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.userId;

    const memberships = await Member.find({ userId })
      .populate("workspaceId")
      .exec();

    const workspaces = memberships
      .map((membership) => membership.workspaceId)
      .map((workspace) => {
        return { ...workspace._doc, inviteCode: decrypt(workspace.inviteCode) };
      });
    res.status(200).json({ workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// get workspace by id
export const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.status(200).json({
      workspace: {
        ...workspace._doc,
        inviteCode: decrypt(workspace.inviteCode),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Update a workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { name, removeImage } = req.body;
    const { workspaceId } = req.params;

    // check permission to update workspace
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.EDIT_WORKSPACE]);

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (name && name !== workspace.name) {
      const existingWorkspace = await Workspace.findOne({
        name,
        _id: { $ne: workspaceId },
      });
      if (existingWorkspace) {
        return res
          .status(400)
          .json({ message: "Workspace name already exists" });
      }
      workspace.name = name;
    }

    let imageUrl = workspace.imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url; // Store the Cloudinary URL
    } else if (removeImage === "true") {
      imageUrl = ""; // Remove image if requested
    }

    workspace.name = name;
    workspace.imageUrl = imageUrl;

    await workspace.save();
    res.status(200).json({
      workspace: {
        ...workspace._doc,
        inviteCode: decrypt(workspace.inviteCode),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Delete a workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.DELETE_WORKSPACE]);

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    // Delete the workspace
    await Workspace.deleteOne({ _id: workspaceId });

    // Delete associated member records
    await Member.deleteMany({ workspaceId });
    await Project.deleteMany({ workspace: workspaceId });

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

//get members of workspace
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.VIEW_ONLY]);

    const members = await Member.find({ workspaceId })
      .populate("userId", "name email")
      .populate("role", "name");

    res.status(200).json({ members });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

//update the role
export const changeMembersRole = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { roleId, memberId } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const member = await Member.findOne({
      userId: memberId,
      workspaceId: workspaceId,
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "Member not found in the workspace" });
    }

    const isRoleExist = await Role.findById(roleId);
    if (!isRoleExist) {
      return res.status(404).json({ message: "Role not found" });
    }

    member.role = roleId;
    await member.save();

    res.status(200).json({ message: "Member role updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const removeMemberFromWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { memberId, email } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.REMOVE_MEMBER]);

    const member = await Member.findOne({
      userId: memberId,
      workspaceId,
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "Member not found in the workspace" });
    }

    await member.deleteOne();
    await Invitation.deleteMany({
      workspaceId,
      inviteeEmail: email,
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
