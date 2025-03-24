import { useWorkspaceStore } from "@/store/workspaceStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import WorkspaceFormDialog from "@/components/workspace/WorkspaceFormDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, Loader, Plus } from "lucide-react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { useProjectStore } from "@/store/projectStore";

const WorkSpaceSwitcher = () => {
  const {
    workspaces,
    activeWorkspaceId,
    getWorkspaceById,
    setActiveWorkspaceId,
  } = useWorkspaceStore();
  const navigate = useNavigate();
  const { isMobile, state } = useSidebar();
  const [open, setOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentWorkspace = async () => {
    if (!activeWorkspaceId) return;
    try {
      setLoading(true);
      const workspace = await getWorkspaceById(activeWorkspaceId);
      setCurrentWorkspace(workspace);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentWorkspace();
  }, [activeWorkspaceId, workspaces]);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey) {
        const index = parseInt(e.key, 10) - 1;
        if (index >= 0 && index < workspaces.length) {
          const targetWorkspace = workspaces[index];
          setActiveWorkspaceId(targetWorkspace._id);
          navigate(`/workspaces/${targetWorkspace._id}`);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [workspaces, setActiveWorkspaceId, navigate]);

  return (
    <>
      <SidebarMenu>
        {state !== "collapsed" && (
          <p className="text-xs font-medium uppercase text-neutral-500">
            Workspaces
          </p>
        )}
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent bg-gray-100 data-[state=open]:text-sidebar-accent-foreground"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin !size-6 mx-auto" />
                ) : (
                  <>
                    <div className="flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Avatar
                        className={`${
                          state === "collapsed" ? "size-8" : "size-10"
                        } rounded-md overflow-hidden flex items-center justify-center`}
                      >
                        {currentWorkspace && currentWorkspace.imageUrl ? (
                          <AvatarImage
                            src={currentWorkspace?.imageUrl}
                            alt={currentWorkspace?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="text-white size-10 rounded-md bg-blue-600 text-lg">
                            {currentWorkspace?.name[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {currentWorkspace?.name}
                      </span>
                    </div>
                  </>
                )}
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground my-2 pl-1">
                Your Workspaces
              </DropdownMenuLabel>
              {workspaces.length > 0 &&
                workspaces.map((workspace, index) => (
                  <DropdownMenuItem
                    key={workspace._id}
                    onClick={() => {
                      setActiveWorkspaceId(workspace._id);
                      navigate(`/workspaces/${workspace._id}`);
                    }}
                    className="gap-2 p-2 size-14 w-full"
                  >
                    <div className="flex items-center justify-center">
                      <Avatar className="h-10 w-10 rounded-md">
                        {workspace.imageUrl ? (
                          <AvatarImage
                            src={workspace.imageUrl}
                            alt={workspace.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center rounded-md">
                            {workspace.name[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex items-center gap-3 justify-between w-full">
                      <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]">
                        {workspace.name}
                      </span>
                      <DropdownMenuShortcut>
                        Alt + {index + 1}
                      </DropdownMenuShortcut>
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
                  Add Workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <WorkspaceFormDialog open={open} setOpen={setOpen} />
    </>
  );
};
export default WorkSpaceSwitcher;
