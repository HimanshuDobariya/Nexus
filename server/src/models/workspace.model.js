import mongoose from "mongoose";
import generateInviteCode from "../utils/generateInviteCode.js";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String, default: "" },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: generateInviteCode,
    },
  },
  { timestamps: true }
);

workspaceSchema.methods.resetInviteCode = async function () {
  this.inviteCode = generateInviteCode();
};

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
