import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartOptions from "./ChartOptions";

const ChartCard = ({
  title = "Untitled",
  children,
  setIsExpand,
  onRefresh,
  handleExportImage,
  handleExportPDF,
  handleExportCSV,
  ref,
}) => {
  return (
    <>
      <Card className="shadow-none  space-y-3">
        <div className="p-6" ref={ref}>
          <CardContent className="p-0 flex items-center justify-between gap-2">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <ChartOptions
              onRefresh={onRefresh}
              setIsExpand={setIsExpand}
              handleExportImage={() => {
                handleExportImage(ref, title);
              }}
              handleExportPDF={() => {
                handleExportPDF(ref, title);
              }}
              handleExportCSV={handleExportCSV}
            />
          </CardContent>

          <CardContent className="p-0">{children}</CardContent>
        </div>
      </Card>
    </>
  );
};
export default ChartCard;
