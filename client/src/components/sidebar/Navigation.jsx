import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { SettingsIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";

const Navigation = () => {
  const { activeWorkspace } = useWorkspaceStore();
  const location = useLocation();
  const routes = [
    {
      label: "Home",
      href: "",
      icon: GoHome,
      activeIcon: GoHomeFill,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
    },
    {
      label: "Members",
      href: "/members",
      icon: UsersIcon,
      activeIcon: UsersIcon,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((item) => {
          const finalUrl = `/workspaces/${activeWorkspace?._id}${item.href}`;
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
