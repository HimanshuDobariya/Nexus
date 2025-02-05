import logo from "../assets/logo.svg";
import { IconButton, Button } from "@material-tailwind/react";
import { MdDarkMode } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="z-10 relative px-4 py-4 flex items-center justify-between ">
      <Link to="/">
        <img src={logo} alt="" className="w-36" />
      </Link>
      <div className="flex items-center gap-2">
        <IconButton variant="text" color="white">
          <MdDarkMode className="text-xl text-white" />
        </IconButton>
        <Button
          color="white"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Signup
        </Button>
      </div>
    </header>
  );
};
export default Header;
