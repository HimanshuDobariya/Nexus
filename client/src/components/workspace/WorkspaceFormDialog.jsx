import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WorkspaceForm from "./WorkspaceForm";

const WorkspaceFormDialog = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Fill in the details to create your new workspace.
          </DialogDescription>
        </DialogHeader>
        <WorkspaceForm setOpen={setOpen} mode="create" initialData={null} />
      </DialogContent>
    </Dialog>
  );
};
export default WorkspaceFormDialog;
