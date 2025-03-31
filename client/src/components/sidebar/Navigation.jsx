"use client"

import { useState, useEffect } from "react"
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
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { RiDashboardHorizontalLine, RiDashboardHorizontalFill } from "react-icons/ri"
import { IoSettingsOutline, IoSettings } from "react-icons/io5"
import { HiOutlineUsers, HiUsers } from "react-icons/hi2"
import { GoProject } from "react-icons/go"
import { AiFillProject } from "react-icons/ai"
import { ChevronRight, Folder, MoreHorizontal, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/store/projectStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConfirmationDilog from "../common/ConfirmationDilog"
import { toast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const Navigation = () => {
  const { isMobile, state } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const { projects, getAllProjects, deleteProject } = useProjectStore()
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const { workspaceId, projectId } = useParams()
  const isCollapsed = state === "collapsed"
  const [projectsPopoverOpen, setProjectsPopoverOpen] = useState(false)

  useEffect(() => {
    getAllProjects(workspaceId)
  }, [workspaceId])

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
  ]

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
    })
  }

  const handleDeleteProject = async () => {
    try {
      setLoading(true)
      if (!selectedProjectId) return
      const deletedProject = await deleteProject(selectedProjectId, workspaceId)
      if (deletedProject?._id === projectId) {
        navigate(`/workspaces/${workspaceId}`)
      }
      setLoading(false)
      toast({
        variant: "success",
        description: "Project deleted successfully.",
      })
      setOpenConfirmDialog(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setOpenConfirmDialog(false)
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Failed to delete project.",
      })
    }
  }

  // Render project items for popover
  const renderProjectItems = () => {
    return (
      <div className="py-2 space-y-1">
        {routes
          .find((route) => route.label === "Projects")
          ?.items?.map((subItem) => {
            const isProjectActive = location.pathname.includes(subItem.url)
            return (
              <div key={subItem.id} className="relative group px-2">
                <div
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted cursor-pointer",
                    isProjectActive && "bg-muted text-primary",
                  )}
                >
                  <div
                    className="flex-grow flex items-center truncate"
                    onClick={() => {
                      navigate(subItem.url)
                      setProjectsPopoverOpen(false)
                    }}
                  >
                    <span className="text-[16px] mr-1">{subItem.emoji}</span>
                    <span>{subItem.title}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-7 w-7 rounded-md p-0 hover:bg-muted flex items-center justify-center">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                      <DropdownMenuItem
                        onClick={() => {
                          navigate(subItem.url)
                          setProjectsPopoverOpen(false)
                        }}
                      >
                        <Folder className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>View Project</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProjectId(subItem.id)
                          setOpenConfirmDialog(true)
                          setProjectsPopoverOpen(false)
                        }}
                      >
                        <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
      </div>
    )
  }

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          {routes.map((item) => {
            const finalUrl = `/workspaces/${workspaceId}${item.href}`
            const isActive =
              location.pathname === finalUrl || item.items?.some((sub) => location.pathname.includes(sub.url))
            const Icon = isActive ? item.activeIcon : item.icon

            // Special handling for Projects when sidebar is collapsed
            if (item.items && isCollapsed) {
              return (
                <SidebarMenuItem key={item.label}>
                  <Popover open={projectsPopoverOpen} onOpenChange={setProjectsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        className={cn("h-10 cursor-pointer text-neutral-500", isActive && "bg-muted text-primary")}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="p-0 w-56">
                      {renderProjectItems()}
                    </PopoverContent>
                  </Popover>
                </SidebarMenuItem>
              )
            }

            // Normal collapsible for Projects when sidebar is expanded
            if (item.items) {
              return (
                <Collapsible key={item.label} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.label}
                        className={cn("h-10 cursor-pointer text-neutral-500", isActive && "bg-muted text-primary")}
                      >
                        <Icon />
                        <span>{item.label}</span>
                        <ChevronRight className="absolute right-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isProjectActive = location.pathname.includes(subItem.url)
                          return (
                            <SidebarMenuSubItem key={subItem.id} className="relative group">
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "h-8 text-neutral-500 cursor-pointer",
                                  isProjectActive && "bg-muted text-primary",
                                )}
                              >
                                <div>
                                  <Link to={subItem.url} className="flex-grow flex items-center truncate">
                                    <span className="text-[16px] mr-1">{subItem.emoji}</span>
                                    <span>{subItem.title}</span>
                                  </Link>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <SidebarMenuAction>
                                        <MoreHorizontal />
                                        <span className="sr-only">More</span>
                                      </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      className="w-48 rounded-lg"
                                      side={isMobile ? "bottom" : "right"}
                                      align={isMobile ? "end" : "start"}
                                    >
                                      <DropdownMenuItem
                                        onClick={() => {
                                          navigate(subItem.url)
                                        }}
                                      >
                                        <Folder className="text-muted-foreground mr-2 h-4 w-4" />
                                        <span>View Project</span>
                                      </DropdownMenuItem>

                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedProjectId(subItem.id)
                                          setOpenConfirmDialog(true)
                                        }}
                                      >
                                        <Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
                                        <span>Delete Project</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            // Regular menu items
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  onClick={() => navigate(finalUrl)}
                  className={cn("h-10 cursor-pointer text-neutral-500", isActive && "bg-muted text-primary")}
                >
                  <div className="flex items-center">
                    <Icon />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
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
          setOpenConfirmDialog(false)
        }}
        loading={loading}
      />
    </>
  )
}

export default Navigation

