import useHasPermission from "@/hooks/useHasPermission";

const PermissionGuard = ({ children, requiredPermission = [] }) => {
  const hasPermission = useHasPermission(requiredPermission);
  return hasPermission ? children : null;
};

export default PermissionGuard;
