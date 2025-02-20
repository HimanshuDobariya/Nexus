import { Button } from "@/components/ui/button";
import logo from "../assets/logo.svg";
import { Link, Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto p-4">
        <nav className="flex items-center justify-between">
          <img src={logo} height={50} width={150} alt="Logo" />
          <Button asChild variant="secondary">
            <Link to={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Sign up" : "Login"}{" "}
            </Link>
          </Button>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
