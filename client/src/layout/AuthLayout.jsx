import { Outlet, Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const AutLayout = () => {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/">
            <img src={logo} className="h-9" alt="Logo" />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[456px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutLayout;
