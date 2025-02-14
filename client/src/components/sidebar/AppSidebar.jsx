import {
  LayoutDashboard,
  CircleCheckBig,
  Users,
  Settings,
  Frame,
  Map,
  PieChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useParams } from "react-router-dom";
import logo from "../../assets/logo.svg";
import NavProjects from "./NavProjects";
import MainNav from "./MainNav";
import UserNav from "./UserNav";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";

const AppSidebar = () => {
  const { username } = useParams();
  const data = {
    mainNav: [
      {
        name: "Dashboard",
        url: `/${username}/workspace/dashboard`,
        icon: LayoutDashboard,
      },
      {
        name: "Tasks",
        url: `/${username}/workspace/tasks`,
        icon: CircleCheckBig,
      },
      {
        name: "Members",
        url: `/${username}/workspace/members`,
        icon: Users,
      },
      {
        name: "Setting",
        url: `/${username}/workspace/setting`,
        icon: Settings,
      },
    ],

    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="#">
          <img src={logo} alt="" className="w-32" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <MainNav items={data.mainNav} />
        <div className="px-2">
          <Separator />
        </div>
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <UserNav  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
