import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileStore } from "@/store/profileStore";
import { BadgeCheck, Bell, Loader, LogOut, User } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DottedSeperator from "@/components/common/DottedSeperator";
import { useAuthStore } from "@/store/authStore";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";

const UserButton = () => {
  const { profile, loading, getProfile } = useProfileStore();
  const { logout } = useAuthStore();
  const naviagte = useNavigate();
  const { workspaceId } = useParams();
  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  const { name, email } = profile;

  const avatarFallback = getAvatarFallbackText(name);
  const avatarFallbackColor = getAvatarColor(name);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          {profile && profile.profileImage ? (
            <AvatarImage
              src={profile.profileImage}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className={`${avatarFallbackColor}`}>
              {avatarFallback}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-72"
        sideOffset={10}
      >
        <div
          className="flex items-center justify-center flex-col gap-2 px-2.5
        py-4"
        >
          <Avatar className="size-[62px]">
            {profile && profile.profileImage ? (
              <AvatarImage
                src={profile.profileImage}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback
                className={`${avatarFallbackColor} text-2xl font-semibold`}
              >
                {avatarFallback}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex items-center justify-center flex-col">
            <p className="font-medium text-neutral-900">{name || "User"}</p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeperator />

        <DropdownMenuGroup className="my-2 space-y-1">
          <DropdownMenuItem
            onClick={() => {
              naviagte(`/workspaces/${workspaceId}/profile`);
            }}
            className="py-2 text-lg"
          >
            <User className="!size-6 mr-2 " /> Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DottedSeperator />
        <DropdownMenuItem
          className="h-10 mt-1 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          onClick={() => {
            logout();
            localStorage.removeItem("activeWorkspaceId");
          }}
        >
          <LogOut className="!size-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
