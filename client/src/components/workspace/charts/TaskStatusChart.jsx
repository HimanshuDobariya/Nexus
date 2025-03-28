import ChartCard from "@/components/common/ChartCard";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

const TaskStatusChart = ({ data, isLoading }) => {
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

  const [activeIndex, setActiveIndex] = React.useState(null);

  const totalVisitors = chartData?.reduce((acc, curr) => acc + curr.count, 0);
  return (
    <ChartCard
      className="flex flex-col shadow-none"
      title="Task Distribution"
      description="Tasks by status"
    >
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          <Loader className="animate-spin size-10 " />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center w-full h-[300px]">
          No Data Availabel
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
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
              outerRadius={100}
              innerRadius={60}
              strokeWidth={5}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeData =
                      activeIndex !== null ? chartData[activeIndex] : null;
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
                          {activeData
                            ? activeData.count.toLocaleString()
                            : totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {activeData
                            ? capitalizeString(activeData.status)
                            : "Total Tasks"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="status"
                  className="flex items-center flex-wrap"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
};
export default TaskStatusChart;
