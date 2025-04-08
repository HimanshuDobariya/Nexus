import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Header from "../../components/common/Header";
import WorkspaceAnalytics from "@/components/workspace/WorkspaceAnalytics";
import { useProjectStore } from "@/store/projectStore";
import { useParams } from "react-router-dom";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";

const Dashboard = () => {
  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false);
  const { workspaceId } = useParams();
  const { getAllProjects } = useProjectStore();

  useEffect(() => {
    getAllProjects(workspaceId);
  }, []);

  return (
    <>
      <main className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col sm:flex-row  justify-between mb-8  gap-2">
          <Header
            title="Workspace OverView"
            description="Here is a summary of your workspace"
          />
          <Button
            onClick={() => {
              setOpenCreateProjectDialog(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <WorkspaceAnalytics />
      </main>
      <CreateProjectDialog
        open={openCreateProjectDialog}
        setOpen={setOpenCreateProjectDialog}
      />
    </>
  );
};
export default Dashboard;
