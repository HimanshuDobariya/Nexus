import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader } from "lucide-react";

const ConfirmationDilog = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  open,
  onOpenChange,
  handleConfirm,
  handleCancel,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-4 sm:flex-row items-center !justify-between">
          <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            type="button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin !size-5" />
            ) : (
              `${confirmText}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmationDilog;
