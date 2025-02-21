import mongoose from "mongoose";
import generateInviteCode from "../utils/generateInviteCode.js";

const workSoaceSchema = new mongoose.Schema(
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

workSoaceSchema.pre("save", async function (next) {
  if (this.inviteCode) return next();

  do {
    this.inviteCode = generateInviteCode();
  } while (await mongoose.model("Workspace").exists({ inviteCode: this.inviteCode }));

  next();
});

const Workspace = mongoose.model("Workspace", workSoaceSchema);

export default Workspace;
