import AppSidebar from "@/components/sidebar/AppSidebar";
import Header from "@/components/sidebar/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CreateWorkspace from "@/pages/workspace/WorkspaceFormCard";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-4 h-full w-full bg-neutral-100">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default WorkspaceLayout;
