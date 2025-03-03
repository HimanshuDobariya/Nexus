import mongoose from "mongoose";
import { encrypt } from "../utils/crypto-encryption.js";

const InvitationSchema = new mongoose.Schema(
  {
    inviteeEmail: {
      type: String,
      required: true,
    },
    inviterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired"],
      default: "pending",
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Invitation = mongoose.model("Invitation", InvitationSchema);
export default Invitation;
