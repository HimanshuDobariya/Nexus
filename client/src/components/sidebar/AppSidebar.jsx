import { Sidebar, SidebarContent, useSidebar } from "../ui/sidebar";
import { Link, useParams } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import logo from "../../assets/logo.svg";
import logoIcon from "../../assets/logoIcon.svg";
import Navigation from "./Navigation";
import DottedSeperator from "../common/DottedSeperator";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";
import NavProjects from "./NavProjects";
import { useEffect } from "react";
import { useProjectStore } from "@/store/projectStore";

const AppSidebar = ({ ...props }) => {
  const { state } = useSidebar();
  const { getAllProjects } = useProjectStore();
  const { workspaceId } = useParams();

  useEffect(() => {
    getAllProjects(workspaceId);
  }, [workspaceId]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to="/">
          <img
            src={state === "collapsed" ? logoIcon : logo}
            alt=""
            height={48}
            width={state === "collapsed" ? 50 : 142}
          />
        </Link>
        <DottedSeperator className="mb-1" />
        <WorkSpaceSwitcher />
        <DottedSeperator className="mt-1" />
      </SidebarHeader>

      <SidebarContent>
        <Navigation />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
