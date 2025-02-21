import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { ImageIcon, Loader } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DottedSeperator from "./DottedSeperator";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required." }),
  image: z.instanceof(File).optional(),
});

const WorkspaceForm = ({ setOpen }) => {
  const [preview, setPreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const navigate = useNavigate();
  const { createWorkspace, loading, currentWorkspace } = useWorkspaceStore();

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

  useEffect(() => {
    if (currentWorkspace) {
      navigate(`/workspaces/${currentWorkspace?._id}`);
    }
  }, [currentWorkspace]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.image) formData.append("image", data.image);

      await createWorkspace(formData);

      toast({
        description: "Workspace created successfully!",
      });
      setPreview(null);
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Failed to create workspace.",
      });
    }
  };

  return (
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
            <div className="flex flex-col items-center gap-y-2 border-2 border-dashed rounded-md py-7">
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
                  <p className="text-sm text-neutral-500">JPG, JPEG or PNG</p>

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

        <DottedSeperator className="py-7" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Create Workspace
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default WorkspaceForm;
