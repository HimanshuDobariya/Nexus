import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import EventCard from "./EventCard";
import CustomToolbar from "./CustomToolbar";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const DataCalander = ({ data }) => {
  const [value, setValue] = useState(new Date());
  const events = data.map((task) => ({
    start: new Date(task?.dueDate),
    end: new Date(task?.dueDate),
    title: task.title,
    project: task.project,
    assignedTo: task.assignedTo?.name,
    status: task.status,
    id: task._id,
    taskCode: task.taskCode,
    priority: task.priority,
  }));

  const handleNavigate = (action) => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    } else if (typeof action === "object" && action instanceof Date) {
      setValue(action);
    }
  };

  return (
    <div className="grid grid-cols-1 overflow-x-auto h-full w-full">
      <Calendar
        localizer={localizer}
        date={value}
        events={events}
        view="month"
        defaultView="month"
        toolbar
        showAllEvents
        className="h-full"
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer.format(date, "EEE", culture) || "",
        }}
        components={{
          eventWrapper: ({ event }) => (
            <EventCard
              id={event.id}
              title={event.title}
              assignedTo={event.assignedTo}
              project={event.project}
              status={event.status}
              taskCode={event.taskCode}
              priority={event.priority}
            />
          ),
          toolbar: (toolbarProps) => (
            <CustomToolbar
              {...toolbarProps}
              date={value}
              onNavigate={handleNavigate}
            />
          ),
        }}
      />
    </div>
  );
};
export default DataCalander;
