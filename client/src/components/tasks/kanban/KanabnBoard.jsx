import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { TaskStatusEnum } from "@/components/enums/TaskEnums";
import { useCallback, useEffect, useState } from "react";
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";
import { useParams } from "react-router-dom";
import { useTaskStore } from "@/store/taskStore";

const KanabnBoard = ({ data = [], onChange }) => {
  const { updateTask } = useTaskStore();
  const { workspaceId } = useParams();

  const boards = [
    TaskStatusEnum.BACKLOG,
    TaskStatusEnum.TODO,
    TaskStatusEnum.IN_PROGRESS,
    TaskStatusEnum.IN_REVIEW,
    TaskStatusEnum.DONE,
  ];

  const [tasks, setTasks] = useState(() => {
    const initialTasks = {
      [TaskStatusEnum.BACKLOG]: [],
      [TaskStatusEnum.TODO]: [],
      [TaskStatusEnum.IN_PROGRESS]: [],
      [TaskStatusEnum.IN_REVIEW]: [],
      [TaskStatusEnum.DONE]: [],
    };

    data.map((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks = {
      [TaskStatusEnum.BACKLOG]: [],
      [TaskStatusEnum.TODO]: [],
      [TaskStatusEnum.IN_PROGRESS]: [],
      [TaskStatusEnum.IN_REVIEW]: [],
      [TaskStatusEnum.DONE]: [],
    };
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full grid grid-cols-1 overflow-x-auto">
        <div className="flex gap-2">
          {boards.map((board) => (
            <div
              key={board}
              className="min-h-[200px] bg-muted p-1.5 rounded-md min-w-[300px] w-full"
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
  );
};
export default KanabnBoard;
