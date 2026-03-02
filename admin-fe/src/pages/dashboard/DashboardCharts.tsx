import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MultipleLineChart from "@/components/ui/charts/MultipleLineChart";
import type { ChartConfig } from "@/components/ui/chart";
import { LineChartIcon } from "lucide-react";
import type { MontlyRecordGrowth } from "@/types/dashboard.types";

const multipleLineChartConfig = {
  totalResidents: {
    label: "Total Residents",
    color: "var(--chart-1)",
  },
  totalNonResidents: {
    label: "Total Non-Residents",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type DashboardChartsProps = {
  monthlyRecordGrowth: MontlyRecordGrowth[]
}

const DashboardCharts = ({ monthlyRecordGrowth }: DashboardChartsProps) => {
  const montlyRecordGrowthData = monthlyRecordGrowth.map((entry) => ({
    month: entry.month,
    totalResidents: entry.totalResidents,
    totalNonResidents: entry.totalNonResidents,
  }));

  return (
    <div>
      <Card className="overflow-auto">
        <CardHeader className="flex items-center gap-2">
          <div className="hidden md:block bg-emerald-100 p-2">
            <LineChartIcon className="text-emerald-700" />
          </div>
          <div>
            <CardTitle className="font-bold md:text-2xl">
              Resident Growth Overview
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <MultipleLineChart
            chartConfig={multipleLineChartConfig}
            chartData={montlyRecordGrowthData}
            xKey="month"
            className="max-h-100 w-full min-w-100 -ml-10 xs:ml-auto pr-10 xs:pr-auto"
          />
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex flex-col xs:flex-row items-center justify-center text-sm w-full gap-5">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <p className="text-chart-1">Resident</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-chart-2" />
              <p className="text-chart-2">Non-Resident</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCharts;
