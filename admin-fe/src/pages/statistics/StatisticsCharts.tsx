import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import BarChartComp from "@/components/ui/charts/BarChartComp";
import MultipleLineChart from "@/components/ui/charts/MultipleLineChart";
import type { Last6MonthTrend, MaterialsCollection } from "@/types/dto";
import { LineChartIcon } from "lucide-react";

const barChartConfig = {
  materials: {
    label: "Materials",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const multipleLineChartConfig = {
  earnedPoints: {
    label: "Earned Points",
    color: "var(--chart-1)",
  },
  redeemedPoints: {
    label: "Redeemed Points",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type StatisticsChartsProps = {
  last6MonthsTrend: Last6MonthTrend[];
  materialsCollection: MaterialsCollection[];
};

const StatisticsCharts = ({
  last6MonthsTrend,
  materialsCollection,
}: StatisticsChartsProps) => {
  const trendData = last6MonthsTrend.map((entry) => ({
    month: entry.month,
    earnedPoints: entry.earnedPoints,
    redeemedPoints: entry.redeemedPoints,
  }));

  const materialsCollectionData = materialsCollection.map((entry) => ({
    material: entry.materialName,
    weight: entry.totalWeight,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {/* Line Chart */}
      <Card>
        <CardHeader className="flex gap-2">
          <div className="bg-emerald-100 p-2">
            <LineChartIcon className="text-emerald-700" />
          </div>
          <div>
            <CardTitle className="font-bold">Points Activity Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MultipleLineChart
            chartConfig={multipleLineChartConfig}
            chartData={trendData}
            xKey="month"
          />
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center text-sm w-full gap-5">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <p className="text-chart-1">Earned</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-chart-2" />
              <p className="text-chart-2">Redeemed</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartComp
            chartConfig={barChartConfig}
            chartData={materialsCollectionData}
            dataKey="weight" 
            xKey="material"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCharts;
