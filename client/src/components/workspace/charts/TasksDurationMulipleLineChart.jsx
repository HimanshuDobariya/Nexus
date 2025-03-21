import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

const TasksDurationMulipleLineChart = ({ data }) => {
  const chartData = [...data];
  const chartConfig = {
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    done: {
      label: "Done",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div>
      <ChartCard className="shadow-none pb-4" title="Task" description="Duration">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="pending"
              type="monotone"
              stroke="var(--color-pending)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="done"
              type="monotone"
              stroke="var(--color-done)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
};
export default TasksDurationMulipleLineChart;
