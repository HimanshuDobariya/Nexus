import { useWorkspaceStore } from "@/store/workspaceStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import WorkspaceFormDialog from "@/components/workspace/WorkspaceFormDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { RiAddCircleFill } from "react-icons/ri";
import axios from "axios";

const WorkSpaceSwitcher = () => {
  const {
    workspaces,
    activeWorkspaceId,
    getWorkspaceById,
    setActiveWorkspaceId,
  } = useWorkspaceStore();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWorkspaceCurrentWorkspace = async () => {
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
    getWorkspaceCurrentWorkspace();
  }, [activeWorkspaceId, workspaces]);

  return (
    <SidebarMenu>
      <div className="flex items-center justify-between my-1">
        <p className="text-sm font-medium uppercase text-neutral-500">
          Workspaces
        </p>
        <RiAddCircleFill
          className="!size-5 text-stone-500 cursor-pointer hover:opacity-75 transition"
          onClick={() => {
            setOpen(true);
          }}
        />
      </div>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground my-1 bg-neutral-200 hover:bg-neutral-200/60"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin !size-6 mx-auto" />
              ) : (
                <>
                  <div className="flex aspect-square size-10 items-center justify-center rounded-md overflow-hidden">
                    {currentWorkspace && currentWorkspace.imageUrl ? (
                      <img
                        src={currentWorkspace?.imageUrl}
                        alt={currentWorkspace?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Avatar className="h-full w-full rounded-md">
                        <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center rounded-md">
                          {currentWorkspace?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentWorkspace?.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
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
                    setActiveWorkspaceId(workspace._id);
                    navigate(`/workspaces/${workspace._id}`);
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

            <div className="px-2">
              {" "}
              <DropdownMenuSeparator />
            </div>
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

      <WorkspaceFormDialog open={open} setOpen={setOpen} />
    </SidebarMenu>
  );
};
export default WorkSpaceSwitcher;
