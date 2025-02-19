import mongoose from "mongoose";

const workSoaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workSoaceSchema);

export default Workspace;
