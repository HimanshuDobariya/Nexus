import { PieChart, Pie, Cell, Sector } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/common/ChartCard";

const TaskMembersChart = ({ data }) => {
  // Convert data into chart format with valid CSS variable names
  const chartData = data?.map((item) => ({
    member: item.member,
    count: item.count,
    fill: `var(--color-${item.member.replace(/\s+/g, "-").toLowerCase()})`,
  }));

  // Generate chart configuration
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
    <ChartCard
      className="flex flex-col shadow-none"
      title="Task Distribution"
      description="Tasks by Members"
    >
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[350px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            dataKey="count"
            nameKey="member"
            outerRadius={100}
            label={({ payload, ...props }) => {
              const textPadding = 8; // Padding inside the box
              const textHeight = 20; // Fixed height for label box
              const textWidth = payload.member.length * 8 + textPadding * 2; // Dynamic width based on text length
              const lineLength = 30; // Distance from pie chart to label (Increase for more spacing)

              // Calculate new label position at the end of the extended line
              const angle = Math.atan2(props.y - props.cy, props.x - props.cx); // Angle of the line
              const adjustedX = props.x + Math.cos(angle) * lineLength; // Extend along the angle
              const adjustedY = props.y + Math.sin(angle) * lineLength; // Extend along the angle

              return (
                <g>
                  {/* Connecting Line (Leader Line) */}
                  <line
                    x1={props.x}
                    y1={props.y} // Start at default label position
                    x2={adjustedX}
                    y2={adjustedY} // Extend line further outward
                    stroke={props.fill} // Match pie slice color
                    strokeWidth={1} // Line thickness
                  />

                  {/* Box Around Text at End of Line */}
                  <rect
                    x={adjustedX - textWidth / 2} // Centering box horizontally
                    y={adjustedY - textHeight / 2} // Centering box vertically
                    width={textWidth} // Dynamic width based on text
                    height={textHeight} // Fixed height
                    fill="white" // Background color
                    stroke={props.fill} // Border color same as pie slice
                    strokeWidth={1} // Border thickness
                    rx={6}
                    ry={6} // Rounded corners
                  />

                  {/* Text Label at End of Line */}
                  <text
                    x={adjustedX}
                    y={adjustedY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={props.fill} // Text color same as pie slice
                    fontSize={10}
                  >
                    {payload.member}
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
    </ChartCard>
  );
};

export default TaskMembersChart;
