import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectForm from "@/components/project/ProjectForm";
import Header from "../../components/common/Header";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <main className="mx-auto">
      <div className="flex flex-col sm:flex-row  justify-between mb-8  gap-2">
        <Header
          title="Workspace OverView"
          description="Here is overview a of your workspace."
        />
        <Button
          onClick={() => {
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <ProjectForm open={isFormOpen} setOpen={setIsFormOpen} />
    </main>
  );
};
export default Dashboard;
