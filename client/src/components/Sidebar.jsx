import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { GoProjectRoadmap } from "react-icons/go";
import logoDark from "../assets/logo-dark.svg";
const Sidebar = () => {
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 sticky top-0 ">
      <div className="mb-2">
        <Link>
          <img src={logoDark} alt="" className="w-32" />{" "}
        </Link>
      </div>
      <List>
        <ListItem>
          <ListItemPrefix>
            <GoProjectRoadmap className="h-5 w-5" />
          </ListItemPrefix>
          Your Projects
        </ListItem>
      </List>
    </Card>
  );
};
export default Sidebar;
