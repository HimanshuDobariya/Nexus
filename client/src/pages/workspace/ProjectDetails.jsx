import EditProjectDilaog from "@/components/project/EditProjectDilaog";
import TaskViewSwitcher from "@/components/tasks/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/projectStore";
import { Edit2, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams();
  const [currentProject, setCurrentProject] = useState(null);
  const { getProjectById, projects } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const getCurrentProject = async () => {
    if (!projectId) return;

    const currentProjects = useProjectStore.getState().projects;
    const projectExists = currentProjects.some((p) => p._id === projectId);

    if (!projectExists) {
      setCurrentProject(null);
      return;
    }

    try {
      setLoading(true);
      const data = await getProjectById(projectId, workspaceId);
      setCurrentProject(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentProject();
  }, [projectId, projects]);

  if (loading) return <Loader className="animate-spin" />;

  return (
    <>
      <div className="px-2 max-w-screen-2xl mx-auto">
        <div className="flex w-full items-center justify-between gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h2 className="flex items-center gap-2">
                  <span className="text-xl sm:text-3xl">
                    {currentProject?.emoji || "📊"}
                  </span>
                  <span className="text-xl sm:text-2xl font-medium ">
                    {currentProject?.name || "Untitled project"}
                  </span>
                </h2>
              </TooltipTrigger>
              {currentProject?.description && (
                <TooltipContent
                  side="right"
                  align="center"
                  sideOffset={10}
                  className="bg-muted text-primary px-3 py-2 rounded-md shadow-lg font-medium max-w-60"
                >
                  <p>{currentProject?.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="outline"
            className="!mt-0 px-2 md:px-4 py-1 text-xs sm:text-[14px]"
            onClick={() => {
              setEdit(true);
            }}
          >
            <Edit2 /> Edit Project
          </Button>
        </div>

        <div className="py-6">
          <TaskViewSwitcher />
        </div>
      </div>
      <EditProjectDilaog
        initialData={currentProject}
        open={edit}
        setOpen={setEdit}
      />
    </>
  );
};
export default ProjectDetails;
