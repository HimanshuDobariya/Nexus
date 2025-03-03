import { useWorkspaceStore } from "@/store/workspaceStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import WorkspaceFormDialog from "@/pages/workspace/WorkspaceFormDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";

const WorkSpaceSwitcher = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace } =
    useWorkspaceStore();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <div className="flex items-center justify-between my-1">
        <p className="text-sm font-medium uppercase text-neutral-500">
          Workspaces
        </p>
        <WorkspaceFormDialog />
      </div>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground my-1 bg-neutral-200/60 hover:bg-neutral-200"
            >
              {activeWorkspace && activeWorkspace.imageUrl ? (
                <div className="size-10 relative overflow-hidden rounded-md">
                  <img
                    src={activeWorkspace?.imageUrl}
                    alt={activeWorkspace?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar className="size-10 relative rounded-md overflow-hidden">
                  <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center rounded-md">
                    {activeWorkspace?.name[0]}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {workspaces.length > 0 &&
              workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => {
                    setActiveWorkspace(workspace._id);
                    window.location.reload();
                  }}
                  className="gap-2 p-2 size-14 w-full"
                >
                  <div className="flex items-center justify-center rounded-sm">
                    <Avatar className="size-10 rounded-md overflow">
                      {workspace.imageUrl ? (
                        <AvatarImage
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="uppercase bg-blue-500 w-full h-full rounded-md text-white font-medium text-xl">
                          {workspace.name[0]}{" "}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <span className="font-medium">{workspace.name}</span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
export default WorkSpaceSwitcher;
