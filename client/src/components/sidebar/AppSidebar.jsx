import { Sidebar, SidebarContent, useSidebar } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import logo from "../../assets/logo.svg";
import logoIcon from "../../assets/logoIcon.svg";
import Navigation from "./Navigation";
import DottedSeperator from "../common/DottedSeperator";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";
import NavProjects from "./NavProjects";

const AppSidebar = ({ ...props }) => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to="/">
          <img
            src={state === "collapsed" ? logoIcon : logo}
            alt=""
            height={48}
            width={state === "collapsed" ? 40 : 200}
          />
        </Link>
        <DottedSeperator />
        <WorkSpaceSwitcher />
        <DottedSeperator />
      </SidebarHeader>

      <SidebarContent>
        <Navigation />
        {state !== "collapsed" && (
          <div className="px-2">
            <DottedSeperator />
          </div>
        )}
        <NavProjects />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
