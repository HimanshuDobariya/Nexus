import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  Calendar as CalendarIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const CustomToolbar = ({ date, onNavigate }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (date) => {
    if (date) {
      onNavigate(date);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4 mb-6 w-full sm:w-auto justify-center">
      <Button
        onClick={() => onNavigate("PREV")}
        variant="outline"
        size="icon"
        className="h-10 w-10"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center hover:bg-transparent h-10 px-3 font-medium gap-2 min-w-64 justify-center"
            )}
          >
            <CalendarIcon className="size-4" />
            <span className="text-xs">{format(date, "MMMM yyyy")}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={() => onNavigate("NEXT")}
        variant="outline"
        size="icon"
        className="h-10 w-10"
      >
        <ChevronRightIcon className="size-4" />
      </Button>

      <Button
        onClick={() => onNavigate("TODAY")}
        variant="outline"
        size="sm"
        className="h-10 ml-2 hidden sm:flex"
      >
        Today
      </Button>
    </div>
  );
};
export default CustomToolbar;
