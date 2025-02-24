import DottedSeperator from "@/components/common/DottedSeperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import axios from "axios";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams();

  const getWorkspaceMembers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/members/${workspaceId}`
      );
      setMembers(data.members);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message ||
          `There is No members associte with workspace.`,
      });
    }
  };

  useEffect(() => {
    getWorkspaceMembers();
  }, []);

  if (loading) return <div>Loading...</div>;

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
        <CardContent className="p-7">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div key={member._id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10 rounded-full border border-neutral-300 bg-neutral-200 flex items-center justify-center">
                      <AvatarFallback className="text-xl text-neutral-600">
                        {member.userId.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className=" font-medium">{member.userId.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.userId.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                      >
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => {
                          console.log("hello");
                        }}
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => {
                          console.log("hello");
                        }}
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-medium text-amber-700 hover:text-amber-700">
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-lg">There are no members</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Members;
