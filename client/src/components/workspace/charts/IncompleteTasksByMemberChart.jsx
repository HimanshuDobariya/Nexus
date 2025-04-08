import { Loader } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { statuses } from "@/components/tasks/data";
import { cn } from "@/lib/utils";

const ChartTooltipContent = ({ payload, hideLabel }) => {
  if (!payload || payload.length === 0) return null;
  const { member, count, statusCounts } = payload[0].payload;

  return (
    <div className="bg-white shadow-lg rounded-lg p-2 min-w-[180px] space-y-2 text-xs text-gray-800">
      {!hideLabel && (
        <div className="font-semibold text-base border-b pb-1">{member}</div>
      )}

      <div className="flex justify-between font-medium">
        <span>Total Tasks:</span>
        <span>{count}</span>
      </div>

      <div className="space-y-1 pt-1">
        {statuses.map(({ value, label, icon: Icon, variant }) => {
          const val = statusCounts?.[value];
          if (!val) return null;

          return (
            <div key={value} className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-1 rounded-md text-xs",
                    variant
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              </span>
              <span className="font-medium">{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const IncompleteTasksByMemberChart = ({ data, isLoading }) => {
  const chartData = data?.map((item) => ({
    member: item.member,
    count: item.count,
    statusCounts: item.statusCounts,
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
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
              right: 30,
              bottom: 30,
            }}
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
              dataKey="member"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return `${value.slice(0, 10)}...`;
              }}
              label={{
                value: "Members",
                position: "insideBottom",
                offset: -30,
                style: { textAnchor: "middle", fontSize: 14, fill: "#555" },
              }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8} barSize={60}>
              <LabelList position="top" offset={12} fontSize={14} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};
export default IncompleteTasksByMemberChart;
