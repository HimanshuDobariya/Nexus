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
import { ImageIcon, Loader } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { toast } from "@/hooks/use-toast";
import { data, useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required." }),
  image: z.instanceof(File).nullable().optional(),
});

const WorkspaceForm = ({ mode, initialData, setOpen }) => {
  const [preview, setPreview] = useState(initialData?.imageUrl || null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      image: null,
    },
  });
  const navigate = useNavigate();
  const { createWorkspace, loading, activeWorkspace, updateWorkspace } =
    useWorkspaceStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    form.setValue("image", null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // If an image is present, add it, otherwise, check for removal
      if (data.image) {
        formData.append("image", data.image);
      } else if (!preview) {
        formData.append("removeImage", "true");
      }

      if (mode === "create") {
        const newWorkspace = await createWorkspace(formData);
        if (newWorkspace) {
          navigate(`/workspaces/${newWorkspace._id}`);
        }
        toast({
          description: "Workspace created successfully!",
        });
      }

      if (mode === "edit") {
        await updateWorkspace(activeWorkspace._id, formData);
        toast({
          description: "Workspace Update successfully!",
        });
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || `Failed to ${mode} workspace.`,
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
                <Avatar
                  className="size-[72px] relative"
                  key={preview || "fallback"}
                >
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

                  {preview ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      disabled={loading}
                      onClick={handleRemoveImage}
                      className="mt-2"
                    >
                      Remove Image
                    </Button>
                  ) : (
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
                  )}

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
        <div className="flex items-center justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Workspace" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default WorkspaceForm;
