import ChartCard from "@/components/common/ChartCard";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const TaskStatusChart = ({ data }) => {
  const capitalizeString = (string) => {
    if (!string) return;
    return string
      .toLowerCase()
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const chartData = data?.map((item) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const chartConfig = data?.reduce(
    (config, item, index) => {
      config[item.status] = {
        label: capitalizeString(item.status),
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { count: { label: "Count" } }
  );

  const totalVisitors = chartData?.reduce((acc, curr) => acc + curr.count, 0);
  return (
    <ChartCard
      className="flex flex-col shadow-none"
      title="Task Distribution"
      description="Tasks by status"
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Tasks
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartCard>
  );
};
export default TaskStatusChart;
