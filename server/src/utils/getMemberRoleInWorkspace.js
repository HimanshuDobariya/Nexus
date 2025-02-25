import Member from "../models/members.model.js";
import Workspace from "../models/workspace.model.js";

export const getMemberRoleInWorkspace = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) throw new Error("workspace not found.");

  const member = await Member.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) throw new Error("You are not a member of this workspace");

  const roleName = member.role?.name;

  return { role: roleName };
};
