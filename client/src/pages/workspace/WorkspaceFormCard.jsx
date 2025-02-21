import DottedSeperator from "@/components/common/DottedSeperator";
import WorkspaceForm from "@/components/common/WorkspaceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WorkspaceFormCard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 px-4">
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
              setOpen={() => {
                return null;
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default WorkspaceFormCard;
