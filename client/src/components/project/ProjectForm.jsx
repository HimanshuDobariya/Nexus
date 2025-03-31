import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
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

const projectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters" }),
  description: z
    .string()
    .max(100, { message: "Description must be at most 100 characters" })
    .optional(),
  emoji: z.string().min(1, { message: "Please select an emoji" }),
  projectKey: z
    .string({ required_error: "Project key is required." })
    .regex(/^[A-Z][A-Z0-9]+$/, {
      message:
        "Key must start with an uppercase letter and contain only uppercase letters & numbers",
    }),
});

const ProjectForm = ({ initialData = null, onSubmit, loading, onCancel }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isEditMode = !!initialData;
  const [isKeyModified, setIsKeyModified] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "📊",
      projectKey: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const projectName = form.watch("name");

  useEffect(() => {
    if (projectName && !isKeyModified) {
      const words = projectName.trim().split(/\s+/);
      let generatedKey = "";

      if (!isEditMode) {
        if (words.length === 1) {
          generatedKey = words[0].substring(0, 2).toUpperCase();
        } else if (words.length > 1) {
          generatedKey = (words[0][0] + words[1][0]).toUpperCase();
        }

        form.setValue("projectKey", generatedKey, { shouldValidate: true });
      }
    }
  }, [projectName, isKeyModified, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
                  <PopoverContent className="p-0 w-full" align="start">
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="error-msg" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectKey"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setIsKeyModified(true); // Mark that user manually changed projectKey

                    if (isEditMode) {
                      form.setError("projectKey", {
                        type: "manual",
                        message:
                          "Changing the project key may break some external integrations.",
                      });
                    } else {
                      form.clearErrors("projectKey");
                    }
                  }}
                />
              </FormControl>
              <FormMessage className="error-msg" />
            </FormItem>
          )}
        />

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

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader className="animate-spin" />}
            {isEditMode ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ProjectForm;
