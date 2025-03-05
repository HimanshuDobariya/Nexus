import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectForm from "@/components/project/ProjectForm";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <main className="mx-auto">
      <div className="flex justify-between items-center mb-8 gap-2">
        <h1 className="text-2xl font-bold">Workspace OverView</h1>
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
