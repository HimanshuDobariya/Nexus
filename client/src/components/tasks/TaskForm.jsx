import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Loader } from "lucide-react";
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
import { useParams } from "react-router-dom";
import DottedSeperator from "../common/DottedSeperator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/TaskEnums";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { useProjectStore } from "@/store/projectStore";
import { useTaskStore } from "@/store/taskStore";
import { toast } from "@/hooks/use-toast";
import { getAvatarFallbackText } from "../avatar/getAvatarFallback";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAvatarColor } from "../avatar/getAvatarColor";

const taskSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Task name must be at least 3 characters" }),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  projectId: z.string({ required_error: "Please select project." }),
});

const TaskForm = ({ initialData = null, setOpen, open, projectId }) => {
  const isEditMode = !!initialData;
  const { workspaceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const { projects } = useProjectStore();
  const { createTask, getAllTasks, updateTask } = useTaskStore();

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatusEnum.TODO,
      priority: TaskPriorityEnum.MEDIUM,
      projectId: projectId || undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

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

  useEffect(() => {
    if (projectId) {
      form.setValue("projectId", projectId);
    }
  }, [projectId, form]);

  useEffect(() => {
    getWorkSpaceMembers();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditMode) {
        await updateTask(
          workspaceId,
          projectId || initialData?.projectId,
          initialData?.id,
          data
        );
        toast({
          description: "Task Updated successfully.",
        });
      } else if (!isEditMode) {
        const task = await createTask(workspaceId, projectId, data);
        toast({
          description: "Task created successfully.",
        });
      }
      if (projectId) {
        await getAllTasks(workspaceId, { projectId });
      } else {
        await getAllTasks(workspaceId);
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
          <DialogTitle>{isEditMode ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription />
          <DottedSeperator />{" "}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
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
                      <Textarea className="min-h-[80px] resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Task Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TaskStatusEnum).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Priority</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Task Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(TaskPriorityEnum).map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                                      className={getAvatarColor(
                                        member.userId?.name
                                      )}
                                    >
                                      {getAvatarFallbackText(
                                        member.userId?.name
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="">
                                    {" "}
                                    {member.userId?.name}
                                  </span>
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

              {!projectId ? (
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem className="relative !mb-6">
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
              ) : null}

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
                                "w-[250px] justify-start text-left font-normal h-11",
                                !field.value && "text-muted-foreground"
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
                {isEditMode ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default TaskForm;
