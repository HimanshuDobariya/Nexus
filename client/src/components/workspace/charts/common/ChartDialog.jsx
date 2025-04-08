import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChartDialog = ({ title, open, setOpen, children }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-screen-lg w-full max-h-[90vh] h-full"
      >
        <DialogHeader>
          <DialogTitle> {title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default ChartDialog;
