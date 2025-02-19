import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const Navigation = ({ routes }) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {routes.map((item, index) => {
          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild size="lg">
                <Link
                  to={item.url}
                  className="text-[18px] flex items-center gap-2 py-2 rounded-md font-medium transition"
                >
                  <item.icon className="!size-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default Navigation;
