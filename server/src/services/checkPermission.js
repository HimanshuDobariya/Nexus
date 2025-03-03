import { RolePermissions } from "../utils/role-permission.js";

export const checkPermission = async (role, requiredPermissions) => {
  try {
    const permissions = RolePermissions[role] || [];

    const hasPermission = requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );
    if (!hasPermission) {
      throw new Error(
        "You do not have the necessary permissions to perform this action"
      );
    }
    return true;
  } catch (error) {
    console.error("Permission Check Failed:", error.message);
    throw error;
  }
};
