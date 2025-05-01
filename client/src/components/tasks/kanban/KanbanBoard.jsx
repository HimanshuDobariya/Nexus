import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";
import { statuses } from "../data";
import DataFilters from "../DataFilters";
import DottedSeperator from "@/components/common/DottedSeperator";
import { Loader } from "lucide-react";

const KanbanBoard = ({ data = [], onChange, filterData, loading }) => {
  const boards = statuses.map((status) => status.value);

  const [tasks, setTasks] = useState(() => {
    const initialTasks = statuses.reduce((acc, status) => {
      acc[status.value] = [];
      return acc;
    }, {});

    data.map((task) => {
      initialTasks[task.status]?.push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks = statuses.reduce((acc, status) => {
      acc[status.value] = [];
      return acc;
    }, {});

    data.map((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status].sort((a, b) => a.position - b.position);
    });
    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) return;

      const sourceStatus = source.droppableId;
      const destStatus = destination.droppableId;

      if (sourceStatus === destStatus && source.index === destination.index) {
        return;
      }

      const updatesPayload = [];
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const sourceColumn = [...newTasks[sourceStatus]];

        const [movedTask] = sourceColumn.splice(source.index, 1);
        if (!movedTask) return prevTasks;

        const updatedMovedTask =
          sourceStatus !== destStatus
            ? {
                ...movedTask,
                status: destStatus,
              }
            : movedTask;

        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        const calculatePosition = (index) =>
          Math.min((index + 1) * 1000, 1_000_000);

        updatesPayload.push({
          _id: updatedMovedTask._id,
          status: destStatus,
          position: calculatePosition(destination.index),
        });

        newTasks[destStatus].forEach((task, index) => {
          if (task && task._id !== updatedMovedTask._id) {
            const newPosition = calculatePosition(index);
            if (task.position !== newPosition) {
              updatesPayload.push({
                _id: task._id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            const newPosition = calculatePosition(index);
            if (task.position !== newPosition) {
              updatesPayload.push({
                _id: task._id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          });
        }

        return newTasks;
      });
      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between flex-wrap">
        <DataFilters filterData={filterData} setPagination={() => {}} />
      </div>

      <DottedSeperator className="my-4" />

      {loading ? (
        <div className="w-full rounded-lg border h-[200px] flex flex-col items-center justify-center">
          <Loader className="!size-8 animate-spin" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="w-full grid grid-cols-1 overflow-x-auto">
            <div className="flex gap-3">
              {boards.map((board) => (
                <div
                  key={board}
                  className="min-h-[200px] bg-muted/60  p-1.5 rounded-md min-w-[250px] w-full"
                >
                  <KanbanColumnHeader
                    board={board}
                    taskCount={tasks[board].length}
                  />
                  <Droppable droppableId={board}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px] py-1.5"
                      >
                        {tasks[board].map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <KanbanCard task={task} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
export default KanbanBoard;
