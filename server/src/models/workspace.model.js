import mongoose from "mongoose";
import {generateInviteCode} from "../utils/uuid.js";
import { encrypt } from "../utils/crypto-encryption.js";

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

workspaceSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("inviteCode")) {
    this.inviteCode = encrypt(this.inviteCode);
  }
  next();
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
