import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/common/ChartCard";

const ProjectTasksChart = ({ data }) => {
  const chartData = data?.map((item) => ({
    project: item.id,
    count: item.count,
    fill: `var(--color-${item.id})`,
  }));
  const chartConfig = data?.reduce(
    (config, item, index) => {
      config[item.id] = {
        label: item.project,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { count: { label: "Count" } }
  );

  console.log(chartConfig);

  return (
    <ChartCard className="shadow-none">
      <ChartContainer config={chartConfig} className="max-h-[300px]">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{ left: 0 }}
          barSize={30} // Adjust bar height here
        >
          <YAxis
            dataKey="project"
            type="category"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => chartConfig[value]?.label}
          />
          <XAxis dataKey="count" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="count" layout="vertical" radius={5} barSize={60}>
            <LabelList
              dataKey="count"
              position="right"
              fill="#000"
              fontSize={20}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};
export default ProjectTasksChart;
