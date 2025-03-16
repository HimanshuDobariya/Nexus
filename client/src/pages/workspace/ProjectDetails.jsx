import ProjectForm from "@/components/project/ProjectForm";
import TaskViewSwitcher from "@/components/tasks/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/projectStore";
import { Edit, Edit2, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams();
  const [currentProject, setCurrentProject] = useState(null);
  const { getProjectById, projects } = useProjectStore();
  const [loading, setLoading] = useState(false);

  const getCurrentProject = async () => {
    if (!projectId) return;
    setLoading(true);
    const data = await getProjectById(projectId, workspaceId);
    setCurrentProject(data);
    setLoading(false);
  };
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    getCurrentProject();
  }, [projectId, projects]);

  return (
    <div className="px-2">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <div>
              <h2
                className="flex items-center gap-3 py-2 text-xl font-medium truncate tracking-tight cursor-pointer group"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <span className="text-2xl sm:text-4xl">
                  {currentProject?.emoji || "📊"}
                </span>
                <span className="text-xl sm:text-4xl group-hover:underline">
                  {currentProject?.name || "Untitled project"}
                </span>
                <Edit className="size-6 sm:size-8 group-hover:underline" />
              </h2>
              <p className="ml-2 mt-2">{currentProject?.description}</p>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          className="!mt-0 text-xs sm:text-[14px]"
          onClick={() => {
            setEdit(true);
          }}
        >
          <Edit2 /> Edit Project
        </Button>
      </div>

      <div className="py-6 max-w-screen-2xl mx-auto">
        <TaskViewSwitcher />
      </div>

      <ProjectForm initialData={currentProject} open={edit} setOpen={setEdit} />
    </div>
  );
};
export default ProjectDetails;
