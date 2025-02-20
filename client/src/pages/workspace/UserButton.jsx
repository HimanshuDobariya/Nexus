import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfileStore } from "@/store/profileStore";
import { Loader, LogOut } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DottedSeperator from "@/components/common/DottedSeperator";
import { useAuthStore } from "@/store/authStore";

const UserButton = () => {
  const { profile, loading, getProfile } = useProfileStore();
  const { logout } = useAuthStore();

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
  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
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
          <Avatar className="size-[62px] border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 text-4xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center flex-col">
            <p className="font-medium text-neutral-900">{name || "User"}</p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeperator />
        <DropdownMenuItem
          className="h-10 mt-1 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <LogOut className="!size-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
