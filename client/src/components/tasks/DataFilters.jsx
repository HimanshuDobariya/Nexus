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
  X,
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

const DataFilters = ({ filterData, setPageNumber, setPageSize }) => {
  const { filters, setFilters, initialFilters } = filterData;
  const [members, setMembers] = useState([]);
  const { workspaceId, projectId } = useParams();
  const { projects } = useProjectStore();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);

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

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === "all" ? "" : value,
    }));
    setPageNumber(1);
    setPageSize(10);
  };

  const handleDateSelect = (date) => {
    if (date) {
      setDate(date);
      handleFilterChange("dueDate", date);
      setOpen(false);
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setDate(null);
    setPageNumber(1);
    setPageSize(10);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
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
              <span className="flex items-center">
                <ArrowRight className="size-4 mr-2" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value={TaskPriorityEnum.LOW}>
              <span className="flex items-center">
                <ArrowDown className="size-4 mr-2" />
                Low
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full lg:w-auto hover:bg-transparent !text-black font-normal justify-start text-left",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2" />
              {date ? format(date, "PPP") : "Select Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              className="w-full lg:w-auto"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="text"
          name="keyword"
          placeholder="Search Task"
          value={filters.keyword}
          onChange={(e) => {
            setFilters((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }}
          className="h-10 max-w-[400px] w-full"
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={handleResetFilters}
          className="w-auto"
        >
          Reset <X />
        </Button>
      </div>
    </div>
  );
};
export default DataFilters;
