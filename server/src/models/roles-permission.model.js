import mongoose from "mongoose";
import { Roles, Permissions } from "../enums/role.enum.js";
import { RolePermissions } from "../utils/role-permission.js";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(Roles),
    required: true,
    unique: true,
  },
  permissions: {
    type: [String],
    enum: Object.values(Permissions),
    required: true,
    default: function () {
      return RolePermissions[this.name];
    },
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
