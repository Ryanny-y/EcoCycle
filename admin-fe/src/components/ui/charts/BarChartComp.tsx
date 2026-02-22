import { Bar, CartesianGrid, XAxis, BarChart, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";

type ChartConfig<T extends string> = Record<
  T,
  {
    label: string;
    color: string;
  }
>;

type ChartData<T extends string> = Array<Record<string, T | string | number>>;

type BarChartProps<T extends string> = {
  chartConfig: ChartConfig<T>;
  chartData: ChartData<T>;
  xKey: string;
  dataKey: string;
};

const BarChartComp = <T extends string>({
  chartConfig,
  chartData,
  xKey,
  dataKey,
}: BarChartProps<T>) => {
  const maxValue = Math.max(
    ...chartData.flatMap((dataPoint) => dataPoint["weight"] as number),
  );

  // Calculate tickInterval so that the chart always has 6 ticks
  let tickInterval = Math.ceil(maxValue / 5);

  // Ensure the tick interval is divisible by 5 or 10
  if (tickInterval % 10 !== 0) {
    // Round up to the nearest multiple of 5 or 10
    tickInterval = Math.ceil(tickInterval / 5) * 5;
  }

  // Generate the 6 ticks (always divisible by 5 or 10)
  const ticks = Array.from({ length: 6 }, (_, i) => i * tickInterval);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          ticks={ticks}
          tickFormatter={(tick) => `${tick}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey={dataKey} fill="var(--chart-3)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartComp;
