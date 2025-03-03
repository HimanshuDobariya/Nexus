import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
const DefaultSkeleton = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-start pt-10 justify-center bg-white">
      <div className="flex items-center space-x-2">
        <Loader className="animate-spin text-neutral-500 size-8" />
      </div>
    </div>
  );
};
export default DefaultSkeleton;
