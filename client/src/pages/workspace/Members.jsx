import DottedSeperator from "@/components/common/DottedSeperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import InviteMembers from "@/components/invitation/InviteMembers";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const Members = () => {
  const { workspaceId } = useParams();
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllRoles = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/roles`
      );
      const availableRoles = data.roles.filter((role) => role.name !== "OWNER");
      setRoles(availableRoles);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const getWorkSpaceMembers = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/workspaces/${workspaceId}/members`
      );
      setMembers(data.members);
    } catch (error) {
      console.log(error);
    }
  };

  const changeRoleOfMembers = async (memberId, roleId) => {
    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/workspaces/${workspaceId}/members/change/role`,
        {
          memberId,
          roleId,
        }
      );
      getWorkSpaceMembers();
      toast({
        description: data.message,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Can't change role.",
      });
    }
  };

  const removeMember = async (memberId, email) => {
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/workspaces/${workspaceId}/members`,
        {
          data: { memberId, email },
        }
      );
      getWorkSpaceMembers();
      toast({
        description: data.message,
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.response?.data.message || "Can't remove member.",
      });
    }
  };

  useEffect(() => {
    getAllRoles();
    getWorkSpaceMembers();
  }, []);

  return (
    <div className="h-full w-full lg:max-w-screen-sm mx-auto space-y-4">
      <Card className="border-none shadow-none">
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
          {!isLoading ? (
            members.length > 0 ? (
              members.map((member, index) => (
                <div key={member._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-10 rounded-full border border-neutral-300 bg-neutral-200 flex items-center justify-center">
                        <AvatarFallback className="text-xl font-medium text-neutral-600">
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
                    <div className="flex items-center justify-center gap-8">
                      <Badge variant="outline" className="text-sm">
                        {member?.role.name}
                      </Badge>

                      {member?.role.name !== "OWNER" && (
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
                              className="font-medium py-2"
                              onClick={() => {
                                changeRoleOfMembers(
                                  member.userId._id,
                                  roles.find((role) => role.name === "ADMIN")
                                    ?._id
                                );
                              }}
                            >
                              Set as Administrator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="font-medium py-2"
                              onClick={() => {
                                changeRoleOfMembers(
                                  member.userId._id,
                                  roles.find((role) => role.name === "MEMBER")
                                    ?._id
                                );
                              }}
                            >
                              Set as Member
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="font-medium py-2"
                              onClick={() => {
                                changeRoleOfMembers(
                                  member.userId._id,
                                  roles.find((role) => role.name === "VIEWER")
                                    ?._id
                                );
                              }}
                            >
                              Set as Viewer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="font-medium py-2 text-amber-700 hover:text-amber-700"
                              onClick={() => {
                                removeMember(
                                  member.userId._id,
                                  member.userId.email
                                );
                              }}
                            >
                              Remove {member?.userId.name.split(" ")[0]}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  {index < members.length - 1 && <Separator className="my-3" />}
                </div>
              ))
            ) : (
              <p className="text-center text-lg">There are no members</p>
            )
          ) : (
            <Loader className="animate-spin mx-auto" />
          )}
        </CardContent>
      </Card>

      <InviteMembers roles={roles} isLoading={isLoading} />
    </div>
  );
};
export default Members;
