import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String },
    email: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    organization: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
