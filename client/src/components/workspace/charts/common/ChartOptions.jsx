import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Expand, Image, RefreshCw, Share2 } from "lucide-react";
import { BsFiletypeCsv } from "react-icons/bs";
import { ImFilePdf } from "react-icons/im";

const ChartOptions = ({
  onRefresh,
  setIsExpand,
  handleExportImage,
  handleExportPDF,
  handleExportCSV,
}) => {
  return (
    <div className="flex items-center gap-2 export-ignore">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setIsExpand(true);
        }}
        className="flex items-center gap-1"
      >
        <Expand className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportImage}>
            <Image /> JPG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPDF}>
            <ImFilePdf /> PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportCSV}>
            <BsFiletypeCsv /> CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ChartOptions;
