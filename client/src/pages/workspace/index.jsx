import DropdownMenu from "../../components/DropdownMenu";
import Sidebar from "../../components/Sidebar";
const index = () => {
  return (
    <div className="p-4 bg-gray-100 flex justify-between items-start">
      <Sidebar />
      <DropdownMenu />
    </div>
  );
};
export default index;
