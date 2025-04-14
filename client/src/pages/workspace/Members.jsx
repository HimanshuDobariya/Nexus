import DottedSeperator from "@/components/common/DottedSeperator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import InviteMembers from "@/components/invitation/InviteMembers";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/common/Header";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { Roles } from "@/components/enums/RoleEnums";
import { useRolesAndMembersStore } from "@/store/useRolesAndMembersStore";
import PermissionGuard from "@/components/common/PermissionGuard";
import { Permissions } from "@/components/enums/PermissionsEnum";
import { useAuthStore } from "@/store/authStore";

const Members = () => {
  const { workspaceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const {
    getAllWorkspaceMembers,
    members,
    getAvailableRolesAndPermissions,
    roles,
  } = useRolesAndMembersStore();
  const [filteredRoles, setFilteredRoles] = useState([]);
  const { user } = useAuthStore();

  const roleDescriptions = {
    [Roles.ADMIN]:
      "Admins can do most things, like update settings and add other admins.",
    [Roles.MEMBER]:
      "Member are the part of the team, and can add, edit and collaborate on all work.",
    [Roles.VIEWER]:
      "Viewers can search through, view and comment on your team's work, but not much else.",
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
      getAllWorkspaceMembers(workspaceId);
      toast({
        variant: "success",
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
      getAllWorkspaceMembers(workspaceId);
      toast({
        variant: "success",
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
    const getWorkSpaceMembers = async () => {
      try {
        await getAllWorkspaceMembers(workspaceId);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllRoles = async () => {
      setIsLoading(true);
      try {
        const data = await getAvailableRolesAndPermissions();
        const filteredRoles = data
          .filter((role) => role.name !== "OWNER")
          .map((role) => ({
            _id: role._id,
            name: role.name,
            description:
              roleDescriptions[role.name] || "No description available",
          }));
        setFilteredRoles(filteredRoles);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getAllRoles();
    getWorkSpaceMembers();
  }, []);

  const sortedMembers = useMemo(() => {
    if (!members) return [];

    return [...members].sort((a, b) => {
      if (a.role.name === "OWNER") return -1;
      if (b.role.name === "OWNER") return 1;

      if (a.userId._id === user?._id) return -1;
      if (b.userId._id === user?._id) return 1;

      return 0;
    });
  }, [members, user?._id]);

  return (
    <div className="h-full w-full lg:max-w-screen-sm mx-auto space-y-4">
      <Header title="Workspace members" />
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Members List</CardTitle>
        </CardHeader>

        <DottedSeperator className="px-7" />
        <CardContent className="p-7">
          {!isLoading ? (
            sortedMembers && sortedMembers.length > 0 ? (
              sortedMembers.map((member, index) => (
                <div key={member._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback
                          className={`size-10 font-medium text-lg rounded-full flex items-center justify-center ${getAvatarColor(
                            member?.userId.name
                          )}`}
                        >
                          {getAvatarFallbackText(member?.userId.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium">
                          {member.userId.name}
                          {member.userId._id === user?._id && (
                            <span className="text-sm text-muted-foreground ml-1">
                              (You)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.userId.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-8">
                      <Badge variant="outline" className="text-sm">
                        {member?.role.name}
                      </Badge>

                      {/* Only show menu if the member is not the current user */}
                      {member.userId._id !== user?._id &&
                        member?.role.name !== "OWNER" && (
                          <PermissionGuard
                            requiredPermission={[
                              Permissions.CHANGE_MEMBER_ROLE,
                              Permissions.REMOVE_MEMBER,
                            ]}
                          >
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
                                      roles.find(
                                        (role) => role.name === "ADMIN"
                                      )?._id
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
                                      roles.find(
                                        (role) => role.name === "MEMBER"
                                      )?._id
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
                                      roles.find(
                                        (role) => role.name === "VIEWER"
                                      )?._id
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
                          </PermissionGuard>
                        )}
                    </div>
                  </div>
                  {index < sortedMembers.length - 1 && (
                    <Separator className="my-3" />
                  )}
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

      <PermissionGuard requiredPermission={[Permissions.ADD_MEMBER]}>
        <InviteMembers roles={filteredRoles} isLoading={isLoading} />
      </PermissionGuard>
    </div>
  );
};
export default Members;
