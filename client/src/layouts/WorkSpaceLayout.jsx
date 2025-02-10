import DrapdownMenu from "../components/DrapdownMenu";
import Sidebar from "../components/Sidebar";

const WorkSpaceLayout = () => {
  return (
    <div className="p-4 bg-gray-100 flex justify-between items-start">
      <Sidebar />
      <DrapdownMenu />
    </div>
  );
};
export default WorkSpaceLayout;
