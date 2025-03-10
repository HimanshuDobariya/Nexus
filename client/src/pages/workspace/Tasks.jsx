import TaskViewSwitcher from "@/components/tasks/TaskViewSwitcher";
const Tasks = () => {
  return (
    <div className="w-full h-full flex-col space-y-8">
      <div className="pl-2">
        <h2 className="text-3xl font-bold tracking-tight">All Tasks</h2>
        <p className="text-muted-foreground">
          Here&apos;s the list of tasks for this workspace!
        </p>
      </div>
      <TaskViewSwitcher />
    </div>
  );
};
export default Tasks;
