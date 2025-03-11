import DottedSeperator from "@/components/common/DottedSeperator";
import AppSidebar from "@/components/sidebar/AppSidebar";
import Header from "@/components/sidebar/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="px-4 mt-2">
          <DottedSeperator />
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default WorkspaceLayout;
