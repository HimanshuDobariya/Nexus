import Invitation from "../models/invitation.model.js";

const updateExpiredInvitations = async () => {
  try {
    const now = new Date();

    const result = await Invitation.updateMany(
      { expiresAt: { $lt: now }, status: "pending" },
      { $set: { status: "expired" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} invitations marked as expired.`);
    } else {
      console.log("No pending invitations have expired.");
    }
  } catch (error) {
    console.error("Error while updating expired invitations:", error);
  }
};

export default updateExpiredInvitations;
