import { getAvatarColor } from "@/components/avatar/getAvatarColor";
import { getAvatarFallbackText } from "@/components/avatar/getAvatarFallback";
import { TaskPriorityEnum, TaskStatusEnum } from "@/components/enums/TaskEnums";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { useProjectStore } from "@/store/projectStore";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarIcon,
  CircleUser,
  FolderIcon,
  Goal,
  ListCheckIcon,
  UserIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

const DataFilters = ({ table, loading, filters, setFilters }) => {
  const [members, setMembers] = useState([]);
  const { workspaceId, projectId } = useParams();
  const { projects } = useProjectStore();
  const selectedDate = filters.dueDate ? new Date(filters.dueDate) : undefined;

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
    getWorkSpaceMembers();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === "all" ? "" : value,
    }));
  };

  if (loading) return null;
  return (
    <div className="flex flex-col lg:flex-row  gap-2">
      <div className="flex items-center h-10 w-full lg:w-60">
        <Input
          placeholder="Filter Tasks..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="w-full lg:max-w-screen-sm h-10"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-10">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatusEnum.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatusEnum.IN_PROGRESS}>
            In Progress
          </SelectItem>
          <SelectItem value={TaskStatusEnum.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatusEnum.TODO}>To Do</SelectItem>
          <SelectItem value={TaskStatusEnum.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.assignedTo}
        onValueChange={(value) => handleFilterChange("assignedTo", value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-10 py-0">
          <div className="flex items-center pr-2">
            {!filters.assignedTo && <CircleUser className="size-4 mr-2" />}
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />

          {members.map((member) => (
            <SelectItem
              key={member.userId._id}
              value={member.userId._id}
              className="cursor-pointer flex items-center"
            >
              <div className="flex items-center">
                <Avatar className="mr-2 w-7 h-7 inline-block rounded-full overflow-hidden">
                  <AvatarFallback
                    className={`${getAvatarColor(
                      member.userId.name
                    )} w-full h-full rounded-full flex items-center justify-center`}
                  >
                    {getAvatarFallbackText(member.userId?.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{member.userId?.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!projectId && (
        <Select
          value={filters.projectId}
          onValueChange={(value) => handleFilterChange("projectId", value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-10">
            <div className="flex items-center pr-2">
              {!filters.projectId && <FolderIcon className="size-4 mr-2" />}
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectSeparator />
            {projects.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                <span className="text-[16px]">{project.emoji}</span>
                <span> {project?.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.priority}
        onValueChange={(value) => handleFilterChange("priority", value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-10">
          <div className="flex items-center pr-2">
            {!filters.priority && <Goal className="size-4 mr-2" />}
            <SelectValue placeholder="All Priorites" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorites</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskPriorityEnum.HIGH}>
            <span className="flex items-center">
              <ArrowUp className="size-4 mr-2" />
              High
            </span>
          </SelectItem>
          <SelectItem value={TaskPriorityEnum.MEDIUM}>
            {" "}
            <span className="flex items-center">
              <ArrowRight className="size-4 mr-2" />
              Medium
            </span>
          </SelectItem>
          <SelectItem value={TaskPriorityEnum.LOW}>
            {" "}
            <span className="flex items-center">
              <ArrowDown className="size-4 mr-2" />
              Low
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full lg:w-auto bg-neutral-100 !text-black font-normal justify-start text-left",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2" />
            {selectedDate ? format(selectedDate, "PPP") : <span>Due Date</span>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            className="w-full lg:w-auto"
            selected={selectedDate}
            onSelect={(date) => handleFilterChange("dueDate", date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default DataFilters;
