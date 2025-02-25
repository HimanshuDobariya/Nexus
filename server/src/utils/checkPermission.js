import { RolePermissions } from "./role-permission.js";

export const checkPermission = (role, requiredPermissions) => {
  const permissions = RolePermissions[role];

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );
  if (!hasPermission)
    throw new Error(
      "You do not have the necessary permissions to perform this action"
    );
};
