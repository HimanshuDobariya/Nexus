import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

const ProjectTasksChart = ({ data, isLoading }) => {
  const chartData = data?.map((item) => ({
    project: item.project,
    count: item.count,
    fill: `var(--color-${item.project.replace(/\s+/g, "-").toLowerCase()})`,
  }));

  const chartConfig = data?.reduce(
    (config, item, index) => {
      const projectId = item.project.replace(/\s+/g, "-").toLowerCase();
      config[projectId] = {
        label: item.project,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { count: { label: "Count" } }
  );

  return (
    <>
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
            data={chartData}
            margin={{
              top: 40,
              right: 30,
              bottom: 30,
            }}
            barCategoryGap={40}
          >
            <CartesianGrid vertical={false} />

            <YAxis
              label={{
                value: "Tasks",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { textAnchor: "middle", fontSize: 14, fill: "#555" },
              }}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />

            <XAxis
              dataKey="project"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return `${value.slice(0, 10)}...`;
              }}
              label={{
                value: "Projects",
                position: "insideBottom",
                offset: -30,
                style: { textAnchor: "middle", fontSize: 14, fill: "#555" },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="count" radius={6} barSize={60}>
              <LabelList position="top" offset={12} fontSize={14} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};
export default ProjectTasksChart;
