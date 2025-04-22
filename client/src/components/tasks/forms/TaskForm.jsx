import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskPriorityEnum, TaskStatusEnum } from "@/components/enums/TaskEnums";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useProjectStore } from "@/store/projectStore";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Loader, User } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { priorities, statuses } from "../data";
import { useRolesAndMembersStore } from "@/store/useRolesAndMembersStore";

const taskSchema = z.object({
  title: z.string().trim().min(1, { message: "Task name is required." }),
  description: z.string().trim().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
});

const TaskForm = ({
  onSubmit,
  loading,
  onCancel,
  mode = "",
  initialData = null,
}) => {
  const { members } = useRolesAndMembersStore();

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || TaskStatusEnum.TODO,
      priority: initialData?.priority || TaskPriorityEnum.MEDIUM,
      assignedTo: initialData?.assignedTo?._id || undefined,
      dueDate:
        (initialData?.dueDate && new Date(initialData?.dueDate)) || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Task Name</FormLabel>
              <FormControl className="!mb-4">
                <Input {...field} />
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
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea className="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          {mode === "edit" || (mode !== "edit" && !initialData?.status) ? (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Task Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Task Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <span className=" flex items-center gap-2">
                              <status.icon className="size-4" />
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Task Priority</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Task Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <span className=" flex items-center gap-2">
                            <priority.icon className="size-4" />
                            {priority.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        <span className="flex items-center">
                          <User className="size-4 mr-2" />
                          Assigned To
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="w-full max-h-[200px] overflow-y-auto">
                      {members.map((member) => (
                        <SelectItem
                          key={member.userId._id}
                          value={member.userId._id}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-7 w-7">
                              <AvatarFallback
                                className={getAvatarColor(member.userId?.name)}
                              >
                                {getAvatarFallbackText(member.userId?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className=""> {member.userId?.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => {
            const [open, setOpen] = useState(false);
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal h-11 hover:bg-transparent"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date().setHours(0, 0, 0, 0)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader className="animate-spin" />}
            {mode === "edit" ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TaskForm;
