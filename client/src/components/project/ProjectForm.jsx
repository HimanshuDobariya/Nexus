import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader, Loader2 } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProjectStore } from "@/store/projectStore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const projectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().optional(),
  emoji: z.string().min(1, { message: "Please select an emoji" }),
});

const ProjectForm = ({ initialData = null, setOpen, open }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isEditMode = !!initialData;
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "📋",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams();
  const { createProject, updateProject } = useProjectStore();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditMode) {
        await updateProject(projectId, workspaceId, data);
        toast({
          description: "Project Upadated successfully.",
        });
      } else if (!isEditMode) {
        const project = await createProject(workspaceId, data);
        navigate(`/workspaces/${workspaceId}/project/${project._id}`);
        toast({
          description: "Project created successfully.",
        });
      }
      setOpen(false);
      form.reset();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setOpen(false);
      setLoading(false);
      form.reset();
      toast({
        variant: "destructive",
        description:
          error.response?.data.message || "Unable to perform action.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your project details"
              : "Create new project and manage with timeline"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:items-end sm:flex-row gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="emoji"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center gap-1">
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Popover
                            open={showEmojiPicker}
                            onOpenChange={setShowEmojiPicker}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-3xl w-12 h-12 p-0"
                                type="button"
                                aria-label="Select emoji"
                              >
                                {field.value}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0 w-full"
                              align="start"
                            >
                              <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                  field.onChange(emojiData.emoji);
                                  setShowEmojiPicker(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage className="error-msg" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormMessage className="error-msg" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your project description"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader className="animate-spin" />}
                {isEditMode ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ProjectForm;
