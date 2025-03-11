import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RiDashboardHorizontalLine,
  RiDashboardHorizontalFill,
} from "react-icons/ri";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";

const Navigation = () => {
  const { activeWorkspaceId } = useWorkspaceStore();
  const navigate = useNavigate();
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
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem
                onClick={() => {
                  navigate(finalUrl);
                }}
              >
                <CollapsibleTrigger
                  asChild
                  className={cn(
                    "h-10 flex items-center rounded-md gap-2.5 font-medium transition hover:text-primary text-neutral-600",
                    isActive && "bg-neutral-100 text-primary"
                  )}
                >
                  <SidebarMenuButton tooltip={item.label}>
                    {<Icon />}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default Navigation;
