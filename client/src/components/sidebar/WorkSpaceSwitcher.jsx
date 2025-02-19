import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import WorkspaceForm from "../common/WorkspaceForm";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";

const WorkSpaceSwitcher = () => {
  const { isMobile } = useSidebar();

  const { workspaces, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentWorkspace) {
      navigate(`/workspace/${currentWorkspace._id}`);
    }
  }, [currentWorkspace]);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
      </div>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="size-14 w-full">
                <div className="flex items-center gap-3 font-medium ">
                  {currentWorkspace?.imageUrl ? (
                    <div className="size-10 relative rounded-md overflow-hidden">
                      <img
                        src={currentWorkspace.imageUrl}
                        alt={currentWorkspace.name}
                        className=" w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Avatar className="size-10 relative rounded-md overflow-hidden">
                      <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center">
                        {currentWorkspace?.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {currentWorkspace?.name}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-72 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Your workspaces
              </DropdownMenuLabel>
              {workspaces.length &&
                workspaces.map((workspace, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      setCurrentWorkspace(workspace);
                    }}
                    className="gap-2 p-2"
                  >
                    <div className="flex items-center gap-3 font-medium ">
                      {workspace.imageUrl ? (
                        <div className="size-10 relative rounded-md overflow-hidden">
                          <img
                            src={workspace.imageUrl}
                            alt={workspace.name}
                            className=" w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-10 relative rounded-md overflow-hidden">
                          <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center">
                            {workspace?.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {workspace?.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <WorkspaceForm open={open} setOpen={setOpen} />
    </div>
  );
};
export default WorkSpaceSwitcher;
