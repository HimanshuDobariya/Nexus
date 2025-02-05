import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div className="grid text-center h-screen items-center py-8 px-4">
      <Outlet />
    </div>
  );
};
export default AuthLayout;
