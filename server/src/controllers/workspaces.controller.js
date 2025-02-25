import Workspace from "../models/workspace.model.js";
import cloudinary from "../config/cloudinary.config.js";
import Member from "../models/members.model.js";
import Role from "../models/roles-permission.model.js";
import { Permissions, Roles } from "../enums/role.enum.js";
import generateInviteCode from "../utils/generateInviteCode.js";
import { getMemberRoleInWorkspace } from "../utils/getMemberRoleInWorkspace.js";
import { checkPermission } from "../utils/checkPermission.js";

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

    res.status(201).json({ workspace: newWorkspace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all workspace that user is a member of it
export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.userId;

    const membership = await Member.find({ userId })
      .populate("workspaceId")
      .exec();

    const workspaces = membership.map((membership) => membership.workspaceId);
    res.status(200).json({ workspaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { name, removeImage } = req.body;
    const { workspaceId } = req.params;

    // check permission to update workspace
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    checkPermission(role, [Permissions.EDIT_WORKSPACE]);

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.name === name) {
      return res.status(400).json({ message: "Workspace name already exists" });
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
    res.status(200).json({ workspace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    checkPermission(role, [Permissions.DELETE_WORKSPACE]);

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    // Delete the workspace
    await Workspace.deleteOne({ _id: workspaceId });

    // Delete associated member records
    await Member.deleteMany({ workspaceId });

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// reset invite code
export const resetInviteCode = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    const { role } = await getMemberRoleInWorkspace(workspace._id, req.userId);
    checkPermission(role, [Permissions.CHANGE_WORKSPACE_SETTINGS]);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    workspace.inviteCode = generateInviteCode();
    await workspace.save();

    return res.status(200).json({ newInviteCode: workspace.inviteCode });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//get members of workspace
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    checkPermission(role, [Permissions.VIEW_ONLY]);

    const members = await Member.find({ workspaceId })
      .populate("userId", "name email")
      .populate("role", "name");

    res.status(200).json({ members });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//update the role
export const changeMembersRole = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { roleId, memberId } = req.body;

    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    checkPermission(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const isRoleExist = await Role.findById(roleId);
    if (!isRoleExist) {
      return res.status(404).json({ message: "Role not found" });
    }

    const member = await Member.findOne({
      userId: memberId,
      workspaceId: workspaceId,
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "Member not found in the workspace" });
    }

    member.role = roleId;
    await member.save();

    res.status(200).json({ member });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const removeMemberFromWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { memberId } = req.body;
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    checkPermission(role, [Permissions.REMOVE_MEMBER]);

    const member = await Member.findOne({
      userId: memberId,
      workspaceId: workspaceId,
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "Member not found in the workspace" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (member.userId.toString() === workspace.owner.toString()) {
      return res
        .status(403)
        .json({ message: "Cannot remove the workspace owner" });
    }

    await member.deleteOne();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
