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
import { CalendarIcon, Loader } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";

const taskSchema = z.object({
  title: z.string().trim().min(1, { message: "Task name is required." }),
  description: z.string().trim().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  projectId: z.string({ required_error: "Please select project." }),
});

const TaskForm = ({
  onSubmit,
  loading,
  onCancel,
  mode = "",
  initialData = null,
}) => {
  const { workspaceId, projectId: paramasProjectId } = useParams();
  const [members, setMembers] = useState([]);
  const { projects } = useProjectStore();

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || TaskStatusEnum.TODO,
      priority: initialData?.priority || TaskPriorityEnum.MEDIUM,
      projectId: initialData?.project?._id || paramasProjectId || undefined,
      assignedTo: initialData?.assignedTo?._id || undefined,
      dueDate:
        (initialData?.dueDate && new Date(initialData?.dueDate)) || undefined,
    },
  });

  useEffect(() => {
    const getWorkSpaceMembers = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/workspaces/${workspaceId}/members`
        );
        setMembers(data.members);
      } catch (error) {
        console.log(error);
      }
    };
    getWorkSpaceMembers();
  }, []);

  const capitalizeString = (status) => {
    return status
      .toLowerCase()
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
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
                        {Object.values(TaskStatusEnum).map((status) => (
                          <SelectItem key={status} value={status}>
                            {capitalizeString(status)}
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
                      {Object.values(TaskPriorityEnum).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {capitalizeString(priority)}
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
                    <SelectValue placeholder="Select Assignee" />
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

        {!paramasProjectId && (
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem className="relative !mb-6">
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          <span className="text-xl">{project.emoji}</span>
                          <span className="text-[16px] ml-1">
                            {project.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="error-msg" />
              </FormItem>
            )}
          />
        )}

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
                      disabled={(date) => date < new Date()}
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
