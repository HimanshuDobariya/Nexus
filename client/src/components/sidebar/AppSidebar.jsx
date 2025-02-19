import { Sidebar, SidebarContent } from "../ui/sidebar";
import { Link } from "react-router-dom";
import { SidebarHeader } from "../ui/sidebar";
import logo from "../../assets/logo.svg";
import Navigation from "./Navigation";
import { CircleCheck, LayoutDashboard, Settings, Users } from "lucide-react";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";
import { Separator } from "@radix-ui/react-dropdown-menu";

const AppSidebar = () => {
  const navigationItems = [
    {
      label: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      url: "#",
      icon: CircleCheck,
    },
    {
      label: "Members",
      url: "#",
      icon: Users,
    },
    {
      label: "Setting",
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="#">
          <img src={logo} alt="" className="w-40" />
        </Link>

        <Separator className="h-[1px] w-full bg-neutral-200 my-1" />
        <WorkSpaceSwitcher />
        <Separator className="h-[1px] w-full bg-neutral-200 my-1" />
      </SidebarHeader>

      <SidebarContent>
        <Navigation routes={navigationItems} />
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
