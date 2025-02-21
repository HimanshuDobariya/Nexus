import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import WorkspaceFormDialog from "@/pages/workspace/WorkspaceFormDialog";
import { useNavigate } from "react-router-dom";

const WorkSpaceSwitcher = () => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-y-2 my-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase text-neutral-500">
          Workspaces
        </p>
        <WorkspaceFormDialog />
      </div>

      <Select
        value={currentWorkspace?._id} // Set current workspace as selected
        onValueChange={(value) => {
          const selectedWorkspace = workspaces.find((ws) => ws._id === value);
          if (selectedWorkspace) {
            setCurrentWorkspace(selectedWorkspace);
            navigate(`/workspaces/${selectedWorkspace._id}`);
          }
        }}
      >
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue />
          <SelectContent>
            {workspaces.length &&
              workspaces.map((workspace) => (
                <SelectItem key={workspace._id} value={workspace._id}>
                  <div className="flex items-center gap-3 font-medium ">
                    {workspace.imageUrl ? (
                      <div className="size-10 relative rounded-md overflow-hidden">
                        <img
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          className=" w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar className="size-10 relative rounded-md overflow-hidden">
                        <AvatarFallback className="text-white bg-blue-600 text-xl font-semibold w-full h-full flex items-center justify-center rounded-md">
                          {workspace?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {workspace?.name}
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  );
};
export default WorkSpaceSwitcher;
