import AppSidebar from "@/components/sidebar/AppSidebar";
import SidebarInsetHeader from "@/components/sidebar/SidebarInsetHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="px-4">
        <SidebarInsetHeader />
        <Separator className="h-[1px] bg-neutral-200 mb-3" />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
export default WorkspaceLayout;
