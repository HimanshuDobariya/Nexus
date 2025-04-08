import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";
import { Pie, PieChart } from "recharts";

const TaskPriorityChart = ({ data, isLoading }) => {
  const capitalizeString = (string) => {
    if (!string) return;
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const chartData = data?.map((item) => ({
    priority: item.priority,
    count: item.count,
    percentage: item.percentage,
    fill: `var(--color-${item.priority})`,
  }));

  const chartConfig = data?.reduce(
    (config, item, index) => {
      config[item.priority] = {
        label: capitalizeString(item.priority),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { count: { label: "Count" } }
  );
  return (
    <div className="overflow-auto">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          <Loader className="animate-spin size-10 " />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          No Data Availabel
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="priority"
              label={({ payload }) => `${payload.percentage}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <ChartLegend
              content={<ChartLegendContent nameKey="priority" />}
              className="flex-wrap gap-2 mb-3 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};
export default TaskPriorityChart;
