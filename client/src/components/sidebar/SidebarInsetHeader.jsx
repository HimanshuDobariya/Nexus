import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { BadgeCheck, Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "@/store/workspaceStore";

const SidebarInsetHeader = () => {
  const { user, logout } = useAuthStore();
  const { name, email } = user;

  const avatarFallBack = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() ?? "U";

  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceStore();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-8" />
      </div>

      <DropdownMenu className="mx-auto">
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition  border border-neutral-200 cursor-pointer">
            <AvatarFallback className="w-full bg-neutral-200 font-medium  text-neutral-600 flex items-center justify-center">
              {avatarFallBack}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-4">
          <div className="flex flex-col items-center justify-center w-72 gap-2 px-2.5 py-4">
            <Avatar className="size-[58px] transition  border border-neutral-200 cursor-pointer">
              <AvatarFallback className="w-full text-3xl bg-neutral-200 font-medium  text-neutral-600 flex items-center justify-center">
                {avatarFallBack}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center justify-center flex-col">
              <p className="text-sm from-muted text-neutral-900">
                {" "}
                {name || "User"}{" "}
              </p>
              <p className="text-xs text-neutral-500">{email}</p>
            </div>
          </div>

          <DropdownMenuSeparator
            className="h-[1px] px-7 my-2
           bg-neutral-200"
          />

          <DropdownMenuGroup className="space-y-2">
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-neutral-100 outline-none"
              onClick={() => {
                navigate(`/workspace/${currentWorkspace?._id}/profile`);
              }}
            >
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-neutral-100 outline-none">
              <BadgeCheck />
              Account
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-neutral-100 outline-none">
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="h-[1px] px-7 my-2 bg-neutral-200" />

          <DropdownMenuItem
            onClick={() => {
              logout();
            }}
            className="h-10 flex items-center justify-center text-amber-700 from-muted cursor-pointer outline-none"
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
export default SidebarInsetHeader;
