import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/common/ChartCard";
import { Loader } from "lucide-react";

const ProjectTasksChart = ({ data, isLoading }) => {
  const chartData = data?.map((item) => ({
    project: {
      id: item.project._id,
      name: item.project.name,
      emoji: item.project.emoji,
    },
    count: item.count,
    fill: `var(--color-${item.project._id})`,
  }));

  const chartConfig = data?.reduce(
    (config, item, index) => {
      config[item.project._id] = {
        label: item.project.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { count: { label: "Count" } }
  );

  return (
    <ChartCard className="shadow-none">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          <Loader className="animate-spin size-10 " />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          No Data Availabel
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="project.id"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(id) => {
                const project = chartData.find(
                  (item) => item.project.id === id
                );
                return project
                  ? `${project.project.emoji} ${project.project.name.split(" ")[0]}...`
                  : "";
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              <LabelList position="top" offset={12} fontSize={18} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
};
export default ProjectTasksChart;
