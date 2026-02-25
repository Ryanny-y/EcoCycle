import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import useFetchData from "@/hooks/useFetchData";
import type { DashboardDataResponse } from "@/types/dto";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import CardSummary from "./dashboard/CardSummary";
import LowStockAlert from "./dashboard/LowStockAlert";
import MonthlyStats from "./dashboard/MonthlyStats";
import DashboardCharts from "./dashboard/DashboardCharts";

const DashboardHome = () => {
  const { data, loading, error, refetchData } =
    useFetchData<DashboardDataResponse>("dashboard");

  console.log(data);

  if (loading) {
    return (
      <div id="home" className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="System status and recent recycling activity."
        />
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-start gap-1">
                <Skeleton className="h-12 w-12 rounded-md mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div id="home" className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="System status and recent recycling activity."
        />
        <ErrorState message={error} onRetry={refetchData} />
      </div>
    );
  }

  if (!data) return;

  return (
    <div id="home" className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="System status and recent recycling activity."
      />

      {/* Cards */}
      <CardSummary
        totalResidents={data.totalResidents}
        totalPointsEarned={data.totalPointsEarned}
        totalMaterialsCollected={data.totalMaterialsCollected}
        totalRewardsRedeemed={data.totalRewardsRedeemed}
      />

      {/* Low Stock */}
      <LowStockAlert lowStockRewardsCount={data.lowStockRewardsCount} />

      {/* Charts */}
      <DashboardCharts monthlyRecordGrowth={data.monthlyRecordGrowth} />

      {/* Quick Insights */}
      <MonthlyStats
        pointsEarnedThisMonth={data.pointsEarnedThisMonth}
        rewardsRedeemedThisMonth={data.rewardsRedeemedThisMonth}
        averagePointsPerResident={data.averagePointsPerResident}
      />
    </div>
  );
};

export default DashboardHome;
