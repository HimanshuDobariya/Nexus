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
  CalendarIcon,
  CircleUser,
  Goal,
  ListCheckIcon,
  UserX,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";
import { priorities, statuses } from "./data";
import { useRolesAndMembersStore } from "@/store/useRolesAndMembersStore";

const DataFilters = ({ filterData, setPagination }) => {
  const { filters, setFilters, initialFilters } = filterData;
  const { getAllWorkspaceMembers, members } = useRolesAndMembersStore();
  const { workspaceId } = useParams();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [searchParams] = useSearchParams();
  const taskView = searchParams.get("task-view");

  useEffect(() => {
    getAllWorkspaceMembers(workspaceId);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value === "all" ? "" : value,
    }));
    setPagination(1, 10);
  };

  const handleDateSelect = (date) => {
    if (date) {
      setDate(date);
      handleFilterChange("dueDate", date);
    }
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({ ...initialFilters });
    setDate(null);
    setPagination(1, 10);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Input
        type="text"
        name="keyword"
        placeholder="Search Task"
        value={filters.keyword ?? ""}
        onChange={(e) => {
          setFilters((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        }}
        className="h-10"
      />
      {taskView !== "kanban" && (
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-10">
            <SelectValue
              placeholder={
                <span className="flex items-center gap-2">
                  <ListCheckIcon className="size-4" />
                  All Statuses
                </span>
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <ListCheckIcon className="size-4" />
                All Statuses
              </span>
            </SelectItem>
            <SelectSeparator />
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  <status.icon className="size-4" />
                  {status.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.assignedTo === null ? "unassigned" : filters.assignedTo}
        onValueChange={(value) =>
          handleFilterChange(
            "assignedTo",
            value === "unassigned" ? null : value
          )
        }
      >
        <SelectTrigger className="w-full lg:w-auto h-10 py-0">
          <SelectValue
            placeholder={
              <span className="flex items-center gap-2">
                <CircleUser className="size-4" />
                Assigned To
              </span>
            }
          />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <CircleUser className="size-4" />
              All Members
            </span>
          </SelectItem>
          <SelectSeparator />

          {members &&
            members.map((member) => (
              <SelectItem
                key={member.userId._id}
                value={member.userId._id}
                className="cursor-pointer flex items-center"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback
                      className={`${getAvatarColor(
                        member.userId.name
                      )} flex items-center justify-center !w-6 !h-6 text-xs rounded-full`}
                    >
                      {getAvatarFallbackText(member.userId?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{member.userId?.name}</span>
                </div>
              </SelectItem>
            ))}
          <SelectItem value="unassigned">
            <span className="flex items-center gap-2">
              <UserX className="size-4" />
              Unassigned
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) => handleFilterChange("priority", value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-10">
          <SelectValue
            placeholder={
              <span className="flex items-center gap-2">
                <Goal className="size-4" />
                All Priorites
              </span>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="flex items-center gap-2">
              <Goal className="size-4" />
              All Priorites
            </span>
          </SelectItem>
          <SelectSeparator />
          {priorities.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              <span className="flex items-center gap-2">
                <priority.icon className="size-4" />
                {priority.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {taskView !== "calendar" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full lg:w-auto hover:bg-transparent !text-black font-normal justify-start text-left",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
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
      )}

      {Object.entries(filters).some(([_, value]) => value) && (
        <Button
          variant="destructive"
          onClick={handleResetFilters}
          className="w-auto"
        >
          Reset <X />
        </Button>
      )}
    </div>
  );
};
export default DataFilters;
