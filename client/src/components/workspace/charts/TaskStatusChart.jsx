import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

const TaskStatusChart = ({ data, isLoading, isDialog = false }) => {
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

  const baseOuter = isDialog ? 220 : 100;
  const baseInner = isDialog ? baseOuter * 0.6 : 60;

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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              outerRadius={baseOuter}
              innerRadius={baseInner}
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
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={({ payload }) => (
                <ul className="flex flex-col gap-2 items-start mr-10">
                  <li className="flex items-center gap-2">
                    
                    <span className="text-muted-foreground text-sm">
                      Status - Tasks
                    </span>
                  </li>
                  {payload?.map((entry, index) => (
                    <li
                      key={`item-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="w-3 h-3 rounded-[2px]"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground text-sm">
                        {capitalizeString(entry.payload.status)} -{" "}
                        {entry.payload.count}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};
export default TaskStatusChart;
