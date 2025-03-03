import { Permissions } from "../enums/role.enum.js";
import { checkPermission } from "../services/checkPermission.js";
import { getMemberRoleInWorkspace } from "../services/getMemberRoleInWorkspace.js";
import Invitation from "../models/invitation.model.js";
import Workspace from "../models/workspace.model.js";
import User from "../models/user.model.js";
import { config } from "../config/env.config.js";
import { sendUserInvitationToJoinWorkspaceEmail } from "../utils/sendEmail.js";
import { decrypt, encrypt } from "../utils/crypto-encryption.js";
import Member from "../models/members.model.js";

export const inviteMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId, email, roleId } = req.body;
    const { inviteCode } = req.params;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the inviter has permission to add members
    const { role } = await getMemberRoleInWorkspace(workspaceId, req.userId);
    await checkPermission(role, [Permissions.ADD_MEMBER]);

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "No workspace found" });
    }

    if (!(inviteCode === decrypt(workspace.inviteCode))) {
      return res.status(200).json({ message: "Invalid invite code" });
    }
    if (user.email === email) {
      return res.status(400).json({ message: "You can't invite yourself." });
    }

    const existingInvitation = await Invitation.findOne({
      inviteeEmail: email,
      status: "pending",
      workspaceId,
    });
    if (existingInvitation) {
      return res
        .status(409)
        .json({ message: "User already has a pending invitation." });
    }

    const acceptedInvitation = await Invitation.findOne({
      inviteeEmail: email,
      status: "accepted",
      workspaceId,
    });
    if (acceptedInvitation) {
      return res
        .status(409)
        .json({ message: "User is already a member of this workspace." });
    }

    const invitation = new Invitation({
      inviteeEmail: email,
      inviterId: req.userId,
      workspaceId,
      roleId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await invitation.save();

    const inviteLink = `${config.client_url}/workspaces/${workspace._id}/join/${inviteCode}?invitationId=${invitation._id}`;

    await sendUserInvitationToJoinWorkspaceEmail(
      user.name,
      user.email,
      workspace.name,
      email,
      inviteLink
    );
    res.status(200).json({ message: "user invite successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode, invitationId } = req.params;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspace = await Workspace.findOne({
      inviteCode: encrypt(inviteCode),
    });
    if (!workspace)
      return res.status(404).json({
        message: "workspace not found",
      });

    const invitation = await Invitation.findOne({
      _id: invitationId,
      inviteeEmail: user.email,
      status: "pending",
    });

    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Invalid or expired invitation." });
    }

    if (invitation.expiresAt < new Date()) {
      return res
        .status(410)
        .json({ message: "Invitation is no longer valid." });
    }

    // Check if user is already a member
    const existingMember = await Member.findOne({
      userId,
      workspaceId: invitation.workspaceId,
    });

    if (existingMember) {
      return res.status(409).json({ message: "User is already a member." });
    }

    await Member.create({
      userId,
      workspaceId: invitation.workspaceId,
      role: invitation.roleId,
      joinedAt: new Date(),
    });

    invitation.status = "accepted";
    await invitation.save();

    res.status(200).json({
      message: "Invitation accepted. You are now a member of the workspace.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const rejectIvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const invitation = await Invitation.findOne({
      _id: invitationId,
      status: "pending",
    });
    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Invalid or expired invitation." });
    }

    invitation.status = "rejected";
    await invitation.save();
    res.json({ message: "You reject the invitation." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
