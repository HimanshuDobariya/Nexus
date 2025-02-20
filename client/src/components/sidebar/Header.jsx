import UserButton from "@/pages/workspace/UserButton";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hover:bg-neutral-100 transition" />
      </div>
      <UserButton />
    </header>
  );
};
export default Header;
