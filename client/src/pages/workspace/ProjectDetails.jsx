import ProjectForm from "@/components/project/ProjectForm";
import { useProjectStore } from "@/store/projectStore";
import { Edit, Loader } from "lucide-react";
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
            <h2
              className="flex items-center gap-3 text-xl font-medium truncate tracking-tight cursor-pointer group"
              onClick={() => {
                setEdit(true);
              }}
            >
              <span className="text-4xl">{currentProject?.emoji || "📊"}</span>
              <span className="text-4xl group-hover:underline">
                {currentProject?.name || "Untitled project"}
              </span>
              <Edit className="size-8 group-hover:underline" />
            </h2>
          )}
        </div>
      </div>

      <ProjectForm initialData={currentProject} open={edit} setOpen={setEdit} />
    </div>
  );
};
export default ProjectDetails;
