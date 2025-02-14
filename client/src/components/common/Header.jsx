import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { Button } from "../ui/button";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navLinks = [
    { path: "/", title: "Home" },
    { path: "/about", title: "About" },
    { path: "/contact", title: "Contact" },
  ];

  return (
    <header className="bg-white fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link to="/">
          <img src={logo} className="h-8" alt="Logo" />
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0">
          <Button
            variant="primary"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </Button>
          <Button
            className="md:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-expanded={isMenuOpen ? "true" : "false"}
            variant="outline"
            size="icon"
          >
            {isMenuOpen ? (
              <IoMdClose className="!h-6 !w-6" />
            ) : (
              <IoMdMenu className="!h-6 !w-6" />
            )}
          </Button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <nav className="flex flex-col p-4 md:p-0 mt-4 space-y-2 md:space-y-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            {navLinks.map(({ path, title }, index) => (
              <NavLink
                key={index}
                to={path}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-sm md:p-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
