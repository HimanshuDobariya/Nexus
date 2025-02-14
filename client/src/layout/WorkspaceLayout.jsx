import SidebarInsetHeader from "@/components/sidebar/SidebarInsetHeader";
import AppSidebar from "../components/sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const workspaceLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarInsetHeader />
          <div className="mb-2">
            <Separator />
          </div>
          <div className="px-6 py-2">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default workspaceLayout;
