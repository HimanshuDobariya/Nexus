import { Sidebar, SidebarContent } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import logo from "../../assets/logo.svg";
import Navigation from "./Navigation";
import DottedSeperator from "../common/DottedSeperator";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="#">
          <img src={logo} alt="" width={164} height={48} />
        </Link>
        <DottedSeperator />
        <WorkSpaceSwitcher />
        <DottedSeperator />
      </SidebarHeader>

      <SidebarContent>
        <Navigation />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
