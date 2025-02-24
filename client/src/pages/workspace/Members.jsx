import DottedSeperator from "@/components/common/DottedSeperator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Members = () => {
  return (
    <div className="h-full w-full lg:max-w-screen-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Members List</CardTitle>
          <CardDescription>
            Here is people that members of this workspace
          </CardDescription>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent />
      </Card>
    </div>
  );
};
export default Members;
