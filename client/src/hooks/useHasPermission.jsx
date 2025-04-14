// hooks/useHasPermission.ts
import { useAuthStore } from "@/store/authStore";
import { useRolesAndMembersStore } from "@/store/useRolesAndMembersStore";
import { useMemo } from "react";

export const useHasPermission = (requiredPermission = []) => {
  const { roles, members } = useRolesAndMembersStore();
  const { user } = useAuthStore();

  const currentMember = useMemo(() => {
    if (!members?.length || !user?._id) return null;
    return members.find((member) => member?.userId?._id === user._id);
  }, [members, user]);

  const userRole = useMemo(() => {
    if (!roles?.length || !currentMember?.role?._id) return null;
    return roles.find(
      (role) => String(role._id) === String(currentMember.role._id)
    );
  }, [roles, currentMember]);

  const hasPermission = useMemo(() => {
    if (!userRole?.permissions?.length || !requiredPermission.length)
      return false;
    return requiredPermission.some((permission) =>
      userRole.permissions.includes(permission)
    );
  }, [userRole, requiredPermission]);

  return hasPermission;
};

export default useHasPermission