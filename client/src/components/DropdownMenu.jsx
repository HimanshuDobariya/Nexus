import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import { FaUser } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";

const DropdownMenu = () => {
  const { user, logout } = useAuthStore();

  const userName = user.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <IconButton className="rounded-full " size="lg">
          {userName}
        </IconButton>
      </MenuHandler>
      <MenuList>
        <MenuItem
          className="flex items-center gap-2"
          onClick={() => {
            navigate(`/workspace/profile/${user._id}`);
          }}
        >
          <FaUser />
          <Typography variant="small" className="font-medium">
            My Profile
          </Typography>
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={handleLogout}>
          <FaPowerOff />
          <Typography variant="small" className="font-medium">
            Logout
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default DropdownMenu;
