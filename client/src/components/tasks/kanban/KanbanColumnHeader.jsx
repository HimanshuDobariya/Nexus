import { TaskStatusEnum } from "@/components/enums/TaskEnums";
import { Button } from "@/components/ui/button";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import CreateTaskDailog from "../forms/CreateTaskDialog";

const statusIconMap = {
  [TaskStatusEnum.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatusEnum.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatusEnum.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatusEnum.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatusEnum.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

const KanbanColumnHeader = ({ board, taskCount }) => {
  const icon = statusIconMap[board];
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="px-2 py-2 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          {icon} <h2 className="font-medium">{board}</h2>
          <div className="size-5 flex items-center justify-center rounded-sm  bg-white shadow text-neutral-700 font-medium">
            {taskCount}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 bg-white border border-neutral-200 shadow-sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          <PlusIcon/>
        </Button>
      </div>
      <CreateTaskDailog
        open={open}
        setOpen={setOpen}
        initialData={{ status: board }}
      />
    </>
  );
};
export default KanbanColumnHeader;
