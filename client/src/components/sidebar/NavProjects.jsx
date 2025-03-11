import { useProjectStore } from "@/store/projectStore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import ProjectForm from "../project/ProjectForm";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { useWorkspaceStore } from "@/store/workspaceStore";
import ConfirmationDilog from "../common/ConfirmationDilog";
import { cn } from "@/lib/utils";

const NavProjects = () => {
  const { isMobile } = useSidebar();
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { getAllProjects, projects, deleteProject } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchProjectsOfWorkspace = async () => {
    setLoading(true);
    try {
      await getAllProjects(workspaceId);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Error to fetch projects.",
      });
    }
  };

  useEffect(() => {
    fetchProjectsOfWorkspace();
  }, [workspaceId]);

  const handleDeleteProject = async (projectId) => {
    try {
      setLoading(true);
      if (!selectedProjectId) return;
      const deletedProject = await deleteProject(
        selectedProjectId,
        workspaceId
      );

      if (deletedProject._id === projectId) {
        const updatedProjects = useWorkspaceStore.getState().projects;

        if (updatedProjects.length > 0) {
          navigate(
            `/workspaces/${workspaceId}/projects/${updatedProjects[0]._id}`
          );
        } else {
          navigate(`/workspaces/${workspaceId}`);
        }
      } else {
        navigate(`/workspaces/${workspaceId}`);
      }
      setLoading(false);
      toast({ description: "Project deleted successfully." });
      setOpenConfirmDialog(false);
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Can't delete project.",
      });
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden  bg-inherit relative overflow-y-auto">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span className="text-sm">Projects</span>
        <Button
          asChild
          className="flex !size-6 p-1 items-center justify-center rounded-md border bg-background cursor-pointer text-neutral-700"
          onClick={() => {
            setOpenProjectModal(true);
          }}
        >
          <Plus className="size-4" />
        </Button>
      </SidebarGroupLabel>

      <SidebarMenu className="my-2">
        {!loading ? (
          projects.length === 0 ? (
            <div className="p-2 text-center">
              <p className="text-xs text-muted-foreground">
                There is no projects in this Workspace yet. Projects you create
                will show up here.
              </p>
              <Button
                variant="secondary"
                type="button"
                className=" text-[13px] hover:underline font-semibold mt-4"
                onClick={() => {
                  setOpenProjectModal(true);
                }}
              >
                Create a project
                <ArrowRight />
              </Button>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = `/workspaces/${workspaceId}/project/${item._id}`;
              const isActive = location.pathname === projectUrl;
              return (
                <SidebarMenuItem
                  key={item._id}
                  className={cn(
                    "h-10 flex items-center rounded-md gap-2.5 font-medium transition hover:text-primary text-neutral-600 hover:bg-neutral-100",
                    isActive && "bg-neutral-100 text-primary"
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link to={projectUrl}>
                      <span className="size-6 text-[16px] flex items-center justify-center bg-white shadow-sm rounded">
                        {item.emoji}
                      </span>
                      <span className="text-[14px]">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover className="size-6 mr-1">
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                      collisionPadding={10}
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setTimeout(() => {
                            navigate(projectUrl);
                          }, 0);
                        }}
                      >
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={loading}
                        onClick={() => {
                          setSelectedProjectId(item._id);
                          setOpenConfirmDialog(true);
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )
        ) : (
          <Loader className=" w-5 h-5 animate-spin place-self-center" />
        )}
      </SidebarMenu>

      <ProjectForm open={openProjectModal} setOpen={setOpenProjectModal} />
      <ConfirmationDilog
        title="Are you sure to delete project?"
        description="This action delete project and task associated with project"
        confirmText="Delete"
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        handleConfirm={handleDeleteProject}
        handleCancel={() => {
          setOpenConfirmDialog(false);
        }}
        loading={loading}
      />
    </SidebarGroup>
  );
};
export default NavProjects;
