import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WorkspaceForm from "@/components/common/WorkspaceForm";
import { RiAddCircleFill } from "react-icons/ri";

const WorkspaceFormDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RiAddCircleFill className="!size-5 text-stone-500 cursor-pointer hover:opacity-75 transition" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Fill in the details to create your new workspace.
          </DialogDescription>
        </DialogHeader>
        <WorkspaceForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default WorkspaceFormDialog;
