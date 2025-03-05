import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardHorizontalLine,
  RiDashboardHorizontalFill,
} from "react-icons/ri";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";

const Navigation = () => {
  const { activeWorkspaceId } = useWorkspaceStore();
  const location = useLocation();
  const routes = [
    {
      label: "Dashboard",
      href: "",
      icon: RiDashboardHorizontalLine,
      activeIcon: RiDashboardHorizontalFill,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: BsCheckCircle,
      activeIcon: BsCheckCircleFill,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: IoSettingsOutline,
      activeIcon: IoSettings,
    },
    {
      label: "Members",
      href: "/members",
      icon: HiOutlineUsers,
      activeIcon: HiUsers,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((item) => {
          const finalUrl = `/workspaces/${activeWorkspaceId}${item.href}`;
          const isActive = location.pathname === finalUrl;

          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link key={item.label} to={finalUrl}>
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition  hover:bg-neutral-200/60 hover:text-primary",
                  isActive && "bg-neutral-200/60 hover:opacity-100 text-primary"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default Navigation;
