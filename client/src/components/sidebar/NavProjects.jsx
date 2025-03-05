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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span className="text-sm">Projects</span>
        <Button
          type="button"
          variant="outline"
          className="size-5 p-0 rounded-full"
          onClick={() => {
            setOpenProjectModal(true);
          }}
        >
          <Plus className="!size-3.5" />
        </Button>
      </SidebarGroupLabel>

      <SidebarGroupContent />

      <SidebarMenu>
        {!loading ? (
          projects.length === 0 ? (
            <div className="p-2 text-center">
              <p className="text-xs text-muted-foreground">
                There is no projects in this Workspace yet. Projects you create
                will show up here.
              </p>
              <Button
                variant="outline"
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
                  className={`rounded-md py-1 flex items-center hover:bg-neutral-100  ${
                    isActive && "bg-neutral-200/60 font-medium text-neutral-900"
                  }`}
                >
                  <SidebarMenuButton asChild className="hover:bg-transparent">
                    <Link to={projectUrl}>
                      <span className="text-xl bg-white rounded-md">
                        {item.emoji}
                      </span>
                      <span className="text-[14px]">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                      <SidebarMenuAction showOnHover className="size-6 mr-1">
                        <MoreHorizontal  />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem
                        onClick={() => navigate(`${projectUrl}`)}
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
