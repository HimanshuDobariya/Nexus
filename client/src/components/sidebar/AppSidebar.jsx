import { Sidebar, SidebarContent } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import logo from "../../assets/logo.svg";
import Navigation from "./Navigation";
import DottedSeperator from "../common/DottedSeperator";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";
import NavProjects from "./NavProjects";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="#">
          <img src={logo} alt="" width={164} height={48} />
        </Link>
        <div className="px-4">
          <DottedSeperator />
        </div>
        <WorkSpaceSwitcher />
        <DottedSeperator />
      </SidebarHeader>

      <SidebarContent>
        <Navigation />
        <div className="px-4">
          <DottedSeperator />
        </div>
        <NavProjects />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
