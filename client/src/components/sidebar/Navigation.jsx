import { useState, useEffect } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  RiDashboardHorizontalLine,
  RiDashboardHorizontalFill,
} from "react-icons/ri";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
import { ChevronRight, Folder, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useProjectStore } from "@/store/projectStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDilog from "../common/ConfirmationDilog";
import { toast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Navigation = () => {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, getAllProjects, deleteProject } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { workspaceId, projectId } = useParams();

  useEffect(() => {
    getAllProjects(workspaceId);
  }, [workspaceId]);

  const routes = [
    {
      label: "Dashboard",
      href: "",
      icon: RiDashboardHorizontalLine,
      activeIcon: RiDashboardHorizontalFill,
    },
    {
      label: "Members",
      href: "/members",
      icon: HiOutlineUsers,
      activeIcon: HiUsers,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: IoSettingsOutline,
      activeIcon: IoSettings,
    },
  ];

  if (projects.length > 0) {
    routes.splice(1, 0, {
      label: "Projects",
      href: "#",
      icon: GoProject,
      activeIcon: AiFillProject,
      items: projects.map((project) => ({
        id: project._id,
        title: project.name,
        emoji: project.emoji,
        url: `/workspaces/${workspaceId}/projects/${project._id}`,
      })),
    });
  }

  const handleDeleteProject = async () => {
    try {
      setLoading(true);
      if (!selectedProjectId) return;
      const deletedProject = await deleteProject(
        selectedProjectId,
        workspaceId
      );
      if (deletedProject?._id === projectId) {
        navigate(`/workspaces/${workspaceId}`);
      }
      setLoading(false);
      toast({
        variant: "success",
        description: "Project deleted successfully.",
      });
      setOpenConfirmDialog(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setOpenConfirmDialog(false);
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Failed to delete project.",
      });
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {routes.map((item) => {
            const finalUrl = `/workspaces/${workspaceId}${item.href}`;
            const isActive =
              location.pathname === finalUrl ||
              item.items?.some((sub) => location.pathname.includes(sub.url));
            const Icon = isActive ? item.activeIcon : item.icon;

            return item?.items ? (
              <Collapsible
                key={item.label}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className={cn(
                        "h-10 cursor-pointer text-neutral-500",
                        isActive && "bg-muted text-primary"
                      )}
                    >
                      <Icon />
                      <span>{item.label}</span>
                      <ChevronRight className="absolute right-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isProjectActive = location.pathname.includes(
                          subItem.url
                        );
                        return (
                          <SidebarMenuSubItem
                            key={subItem.id}
                            className="relative group"
                          >
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "h-8  text-neutral-500 cursor-pointer",
                                isProjectActive && "bg-muted text-primary"
                              )}
                            >
                              <div>
                                <Link
                                  to={subItem.url}
                                  className="flex-grow flex items-center truncate"
                                >
                                  <span className="text-[16px] mr-1">
                                    {subItem.emoji}
                                  </span>
                                  <span>{subItem.title}</span>
                                </Link>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction>
                                      <MoreHorizontal />
                                      <span className="sr-only">More</span>
                                    </SidebarMenuAction>
                                  </DropdownMenuTrigger>{" "}
                                  <DropdownMenuContent
                                    className="w-48 rounded-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align={isMobile ? "end" : "start"}
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        navigate(subItem.url);
                                      }}
                                    >
                                      <Folder className="text-muted-foreground" />
                                      <span>View Project</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedProjectId(subItem.id);
                                        setOpenConfirmDialog(true);
                                      }}
                                    >
                                      <Trash2 className="text-muted-foreground" />
                                      <span>Delete Project</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  onClick={() => navigate(finalUrl)}
                  className={cn(
                    "h-10 cursor-pointer  text-neutral-500",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <div className="flex items-center">
                    <Icon />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
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
    </>
  );
};

export default Navigation;
