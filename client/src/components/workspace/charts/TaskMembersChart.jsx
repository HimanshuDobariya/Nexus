import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader } from "lucide-react";

const TaskMembersChart = ({ data, isLoading }) => {
  const chartData = data?.map((item) => ({
    member: item.member,
    count: item.count,
    fill: `var(--color-${item.member.replace(/\s+/g, "-").toLowerCase()})`,
  }));

  const chartConfig = data?.reduce(
    (config, item, index) => {
      const memberId = item.member.replace(/\s+/g, "-").toLowerCase();
      config[memberId] = {
        label: item.member,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return config;
    },
    { member: { label: "Member" } }
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
        <ChartContainer config={chartConfig} className="mx-auto w-full">
          <PieChart
            margin={{
              top: 40,
              right: 40,
              bottom: 40,
              left: 40,
            }}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              dataKey="count"
              nameKey="member"
              labelLine={false}
              label={({ cx, cy, midAngle, outerRadius, payload, fill }) => {
                const RADIAN = Math.PI / 180;
                const angle = -midAngle * RADIAN;
                const offset = 30;
                const lineLength = 25;

                const sx = cx + outerRadius * Math.cos(angle);
                const sy = cy + outerRadius * Math.sin(angle);
                const mx = cx + (outerRadius + offset) * Math.cos(angle);
                const my = cy + (outerRadius + offset) * Math.sin(angle);
                const ex =
                  mx +
                  (midAngle <= 90 || midAngle >= 270 ? 1 : -1) * lineLength;
                const ey = my;

                const textAnchor =
                  midAngle <= 90 || midAngle >= 270 ? "start" : "end";

                const labelText = `${payload.member} = ${payload.count}`;
                const textPadding = 12;
                const fontSize = 12;
                const charWidth = 7;
                const textWidth = labelText.length * charWidth;
                const rectWidth = textWidth + textPadding * 2;
                const rectHeight = 32;
                const rectX = textAnchor === "start" ? ex : ex - rectWidth;
                const rectY = ey - rectHeight / 2;

                const textX = rectX + rectWidth / 2;
                const textY = rectY + rectHeight / 2;

                return (
                  <g>
                    <path
                      d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
                      stroke={fill}
                      fill="none"
                      strokeWidth={1.5}
                    />
                    <rect
                      x={rectX}
                      y={rectY}
                      width={rectWidth}
                      height={rectHeight}
                      fill={fill}
                      rx={6}
                      ry={6}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#fff"
                      fontSize={fontSize}
                      dominantBaseline="middle"
                      textAnchor="middle"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default TaskMembersChart;
