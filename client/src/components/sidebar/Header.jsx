import UserButton from "@/pages/workspace/UserButton";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { workspaceId } = useParams();

  const getPageLabel = (pathname) => {
    if (pathname.includes("/projects/")) return "Projects";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/tasks")) return "Tasks";
    if (pathname.includes("/members")) return "Members";
    if (pathname.includes("/profile")) return "Profile";
    return "Dashboard"; // Default label
  };

  const pageHeading = getPageLabel(pathname);

  return (
    <header className="flex pr-4 py-2 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 hover:bg-neutral-100 p-1 size-10" />
        <Separator orientation="vertical" className="mr-2 h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block text-[15px]">
              {pageHeading === "Dashboard" ? (
                <BreadcrumbPage className="line-clamp-1">
                  Dashboard
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`/workspaces/${workspaceId}`}>Dashboard</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {pageHeading !== "Dashboard" && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="text-[15px]">
                  <BreadcrumbPage className="line-clamp-1">
                    {pageHeading}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <UserButton />
    </header>
  );
};
export default Header;
