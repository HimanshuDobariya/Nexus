import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { ImageIcon, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useNavigate } from "react-router-dom";
import { worker } from "globals";

const formSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required." }),
  image: z.instanceof(File).optional(),
});

const WorkspaceForm = ({ open, setOpen }) => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { createWorkspace, loading, getWorkSpaces } = useWorkspaceStore();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file); // Set the image value in the form state
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.image) formData.append("image", data.image);

      await createWorkspace(formData);

      toast({
        description: "Workspace created successfully!",
      });
      setOpen(false);
      setPreview(null);
      form.reset();
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to create workspace.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a work space</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="error-msg" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    <Avatar className="size-[72px] relative">
                      {preview ? (
                        <AvatarImage
                          src={preview}
                          alt="Preview"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className=" flex items-center justify-center bg-neutral-100 w-full">
                          <ImageIcon className="size-[36px] text-neutral-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <p className="text-sm">Workspace Image</p>
                      <p className="text-sm text-neutral-500">
                        JPG, JPEG or PNG
                      </p>

                      <Button
                        type="button"
                        variant="teritary"
                        size="xs"
                        disabled={loading}
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                        className="mt-2"
                      >
                        Upload Image
                      </Button>
                      <Input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            />

            {/* <FormField /> */}
            <Button type="submit" size="lg" disabled={loading}>
              {loading && <Loader className="animate-spin" />} Create Workspace
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default WorkspaceForm;
