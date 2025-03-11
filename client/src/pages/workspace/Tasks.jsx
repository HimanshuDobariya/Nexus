import Header from "@/components/common/Header";
import TaskViewSwitcher from "@/components/tasks/TaskViewSwitcher";
const Tasks = () => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto h-full flex-col space-y-8">
      <Header
        title="All Tasks"
        description="Here's the list of tasks for this workspace!"
      />
      <TaskViewSwitcher />
    </div>
  );
};
export default Tasks;
