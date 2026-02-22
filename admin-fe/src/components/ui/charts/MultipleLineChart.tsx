import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";
import dayjs from "dayjs";

// Generic types for chartConfig and chartData
type ChartConfig<T extends string> = Record<
  T,
  {
    label: string;
    color: string;
  }
>;

type ChartData<T extends string> = Array<Record<string, T | string | number>>;

// Component props
type MultipleLineChartProps<T extends string> = {
  chartConfig: ChartConfig<T>;
  chartData: ChartData<T>;
  xKey: string;
};

const MultipleLineChart = <T extends string>({
  chartConfig,
  chartData,
  xKey,
}: MultipleLineChartProps<T>) => {
  const lineKeys = Object.keys(chartConfig) as T[];
  
  const maxValue = Math.max(
    ...chartData.flatMap((dataPoint) => lineKeys.map((key) => dataPoint[key] as number))
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
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value ? dayjs(value).format("MMM") : ''}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          ticks={ticks}
          tickFormatter={(tick) => `${tick}`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        {lineKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={{
              fill: chartConfig[key].color,
            }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default MultipleLineChart;