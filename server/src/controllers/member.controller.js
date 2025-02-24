import Member from "../models/members.model.js";
import Workspace from "../models/workspace.model.js";

//get members of workspace
export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const members = await Member.find({ workspaceId }).populate(
      "userId",
      "name email"
    );

    if (!members.length) {
      return res
        .status(404)
        .json({ message: "No members found for this workspace" });
    }

    res.status(200).json({ members });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//add members in workspace
export const addMember = async (req, res) => {};

//update the role
export const updateMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const updatedMember = await Member.findOneAndUpdate(
      { userId: memberId },
      { role },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member role updated successfully", updatedMember });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete members
export const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const deletedMember = await Member.findOneAndDelete({ userId: memberId });

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
