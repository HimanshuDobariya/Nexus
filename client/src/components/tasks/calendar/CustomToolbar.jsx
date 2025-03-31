import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CustomToolbar = ({ date, onNavigate }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), "MMMM")
  );
  const years = Array.from({ length: 31 }, (_, i) => 2000 + i);
  const handleDateSelect = (date) => {
    if (date) {
      onNavigate(date);
      setCalendarOpen(false);
    }
  };
  return (
    <div className="flex items-center gap-2 mt-4 mb-6 w-full sm:w-auto justify-center">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate("PREV")}
        className="h-9 w-9 shadow-none"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      <div className="text-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="px-4 !min-w-52 font-normal shadow-none"
            >
              {format(date, "MMMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 flex space-x-2">
            <Select
              onValueChange={(month) =>
                onNavigate(new Date(date.getFullYear(), months.indexOf(month)))
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={format(date, "MMMM")} />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(year) =>
                onNavigate(new Date(parseInt(year), date.getMonth()))
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder={date.getFullYear()} />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate("NEXT")}
        className="h-9 w-9 shadow-none"
      >
        <ChevronRightIcon className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
      <Button
        variant="outline"
        className="ml-4 shadow-none"
        onClick={() => onNavigate("TODAY")}
      >
        This Month
      </Button>
    </div>
  );
};
export default CustomToolbar;
