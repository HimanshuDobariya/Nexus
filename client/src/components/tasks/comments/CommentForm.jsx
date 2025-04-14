"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  content: z.string().trim().min(1),
  mentions: z.array(z.string()).optional(),
});

// Update the CommentForm function signature to provide a default onSubmit function
const CommentForm = ({
  initialValue = "",
  onSubmit = () => {},
  onCancel,
  submitLabel = "Comment",
  members = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const isEditing = initialValue !== "";
  const textareaRef = useRef(null);
  const mentionDropdownRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialValue,
      mentions: [],
    },
  });

  const content = form.watch("content");
  const mentions = form.watch("mentions") || [];

  useEffect(() => {
    if (initialValue) {
      form.reset({ content: initialValue, mentions: [] });
    }
  }, [initialValue, form]);

  useEffect(() => {
    // Close mention dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowMentions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update the handleSubmit function to add error handling
  const handleSubmit = async (data) => {
    try {
      // Check if onSubmit is a function before calling it
      if (typeof onSubmit === "function") {
        await onSubmit(data);
      } else {
        console.warn("onSubmit prop is not a function");
      }

      if (!initialValue) {
        form.reset({ content: "", mentions: [] });
        setIsFocused(false);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  // Update the handleTextareaChange function to work with the new member structure
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    // Check if we should show the mention dropdown
    const textBeforeCursor = value.substring(0, cursorPos);
    const atSignIndex = textBeforeCursor.lastIndexOf("@");

    if (
      atSignIndex !== -1 &&
      (atSignIndex === 0 ||
        textBeforeCursor[atSignIndex - 1] === " " ||
        textBeforeCursor[atSignIndex - 1] === "\n")
    ) {
      const mentionText = textBeforeCursor.substring(atSignIndex + 1);

      // Only show dropdown if there's no space after the @ symbol
      if (!mentionText.includes(" ") && !mentionText.includes("\n")) {
        setMentionFilter(mentionText.toLowerCase());
        setShowMentions(true);

        // Position the dropdown
        if (textareaRef.current) {
          const textareaRect = textareaRef.current.getBoundingClientRect();
          const lineHeight = Number.parseInt(
            getComputedStyle(textareaRef.current).lineHeight
          );

          // Calculate position based on textarea and cursor position
          // This is a simplified calculation and might need adjustment
          const lines = textBeforeCursor.split("\n");
          const currentLine = lines.length;

          setMentionPosition({
            top: currentLine * lineHeight + 5,
            left: 10, // Adjust as needed
          });
        }

        return;
      }
    }

    setShowMentions(false);
  };

  // Update the insertMention function to work with the new member structure
  const insertMention = (member) => {
    if (!textareaRef.current) return;

    const currentContent = form.getValues("content");
    const cursorPos = cursorPosition;

    // Find the position of the @ symbol before the cursor
    const textBeforeCursor = currentContent.substring(0, cursorPos);
    const atSignIndex = textBeforeCursor.lastIndexOf("@");

    if (atSignIndex !== -1) {
      // Replace the @mention text with the selected member's name
      const newContent =
        currentContent.substring(0, atSignIndex) +
        `@${member.userId.name} ` +
        currentContent.substring(cursorPos);

      // Update the form value
      form.setValue("content", newContent);

      // Update mentions array
      const currentMentions = form.getValues("mentions") || [];
      if (!currentMentions.includes(member.userId._id)) {
        form.setValue("mentions", [...currentMentions, member.userId._id]);
      }

      // Hide the dropdown
      setShowMentions(false);

      // Focus back on textarea and set cursor position after the inserted mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = atSignIndex + member.userId.name.length + 2; // +2 for @ and space
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          setCursorPosition(newCursorPos);
        }
      }, 0);
    }
  };

  // Update the filteredMembers calculation to work with the new member structure
  const filteredMembers = members?.filter((member) =>
    member.userId.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

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
                    placeholder="Add Comment... (Use @ to mention members)"
                    className="min-h-[80px] resize-none"
                    ref={textareaRef}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTextareaChange(e);
                    }}
                    onKeyDown={(e) => {
                      // Close dropdown on escape
                      if (e.key === "Escape" && showMentions) {
                        e.preventDefault();
                        setShowMentions(false);
                      }

                      // Navigate through dropdown with arrow keys
                      if (
                        showMentions &&
                        (e.key === "ArrowDown" || e.key === "ArrowUp")
                      ) {
                        e.preventDefault();
                        // Implement dropdown navigation if needed
                      }

                      // Select member with Enter or Tab
                      if (
                        showMentions &&
                        (e.key === "Enter" || e.key === "Tab") &&
                        filteredMembers.length > 0
                      ) {
                        e.preventDefault();
                        insertMention(filteredMembers[0]);
                      }
                    }}
                  />
                </FormControl>

                {showMentions && filteredMembers.length > 0 && (
                  <div
                    ref={mentionDropdownRef}
                    className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto w-[250px]"
                    style={{
                      top: `${mentionPosition.top}px`,
                      left: `${mentionPosition.left}px`,
                    }}
                  >
                    <ul className="py-1">
                      {filteredMembers.map((member) => (
                        <li
                          key={member._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() => insertMention(member)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar>
                              <AvatarFallback
                                className={`${getAvatarColor(
                                  member.userId.name
                                )}`}
                              >
                                {getAvatarFallbackText(member.userId.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {member.userId.name}
                              </span>
                              <span className="text-xs text-muted-foreground capitalize">
                                {member.role.name.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                    form.reset({ content: "", mentions: [] });
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
