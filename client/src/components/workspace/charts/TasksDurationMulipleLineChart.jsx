import { Loader } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/common/ChartCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TasksDurationMulipleLineChart = ({
  data,
  isLoading,
  selectedYear,
  setSelectedYear,
}) => {
  const chartData = [...data];
  const chartConfig = {
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    done: {
      label: "Done",
      color: "hsl(var(--chart-2))",
    },
  };

  const hasData = data.filter(
    (item) => item.pending !== 0 || item.done !== 0
  ).length;

  return (
    <div>
      <ChartCard className="shadow-none pb-4">
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[180px] ml-auto mb-4">
            <SelectValue>
              {selectedYear ? selectedYear : "Select Year"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => {
              const year = String(new Date().getFullYear() - i);
              return (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[300px]">
            <Loader className="animate-spin size-10 " />
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center w-full h-[300px]">
            No Data Availabel
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="pending"
                type="monotone"
                stroke="var(--color-pending)"
                fill="var(--color-pending)"
                strokeWidth={2}
                dot={false}
                fillOpacity={0.3}
              />
              <Area
                dataKey="done"
                type="monotone"
                stroke="var(--color-done)"
                fill="var(--color-done)"
                strokeWidth={2}
                dot={false}
                fillOpacity={0.3}
              />
              {/* <Line
                dataKey="pending"
                type="monotone"
                stroke="var(--color-pending)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="done"
                type="monotone"
                stroke="var(--color-done)"
                strokeWidth={2}
                dot={false}
              /> */}
            </AreaChart>
          </ChartContainer>
        )}
      </ChartCard>
    </div>
  );
};
export default TasksDurationMulipleLineChart;
