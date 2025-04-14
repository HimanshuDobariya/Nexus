import DottedSeperator from "@/components/common/DottedSeperator";
import WorkspaceForm from "./WorkspaceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const WorkspaceFormCard = () => {
  const { logout } = useAuthStore();
  return (
    <div className="min-h-screen bg-neutral-100 p-4">
      <Button
        className="ml-auto flex items-center"
        variant="destructive"
        onClick={() => {
          logout();
          localStorage.removeItem("activeWorkspaceId");
        }}
      >
        <LogOut className="!size-4 mr-1" /> Log out
      </Button>
      <div className="flex items-center justify-center ">
        <div className=" p-4 w-full  lg:max-w-screen-md mx-auto rounded-md">
          <Card className="w-full shadow-none border-none">
            <CardHeader className="flex p-7">
              <CardTitle className="text-xl font-bold">
                Create a new workspace
              </CardTitle>
            </CardHeader>
            <div className="px-7">
              <DottedSeperator />
            </div>
            <CardContent className="p-7">
              <WorkspaceForm
                mode="create"
                initialData={null}
                setOpen={() => {
                  return null;
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default WorkspaceFormCard;
