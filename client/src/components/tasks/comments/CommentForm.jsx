import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().trim().min(1),
});

const CommentForm = ({
  initialValue = "",
  onSubmit,
  onCancel,
  submitLabel = "Comment",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isEditing = initialValue !== "";
  const textareaRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialValue,
    },
  });

  const content = form.watch("content");

  useEffect(() => {
    if (initialValue) {
      form.reset({ content: initialValue });
    }
  }, [initialValue, form]);

  const handleSubmit = async (data) => {
    await onSubmit(data);
    if (!initialValue) {
      form.reset({ content: "" });
      setIsFocused(false);
    }
  };

  console.log(isFocused);

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="relative bg-white">
                <FormControl className="!mb-4">
                  <Textarea
                    {...field}
                    placeholder="Add Comment..."
                    className="min-h-[80px] resize-none"
                    ref={textareaRef}
                    onFocus={() => setIsFocused(true)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {(isFocused || isEditing) && (
            <div className="flex items-center gap-x-2 mt-3">
              <Button
                size="sm"
                type="submit"
                disabled={form.formState.isSubmitting || !content?.trim()}
              >
                {submitLabel}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!isEditing) {
                    form.reset({ content: "" });
                    setIsFocused(false);
                    textareaRef.current?.blur();
                  } else if (onCancel) {
                    onCancel();
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
export default CommentForm;
