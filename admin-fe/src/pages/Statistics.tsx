import PageHeader from "@/components/shared/PageHeader";

import StatisticsCard from "./statistics/StatisticsCard";
import StatisticsCharts from "./statistics/StatisticsCharts";
import StatisticsRanking from "./statistics/StatisticsRanking";
import useFetchData from "@/hooks/useFetchData";
import type { RewardStatisticsResponse } from "@/types/dto";
import type { ApiResponse } from "@/types/api";
import { StatisticsSkeleton } from "@/components/shared/SkeletonLoadings";
import { ErrorState } from "@/components/shared/ErrorState";

const Statistics = () => {
  const { data, loading, error, refetchData } = useFetchData<
    ApiResponse<RewardStatisticsResponse>
  >("rewards/statistics");

  if (loading) {
    <StatisticsSkeleton />;
  }

  if (error)
    return (
      <>
        <PageHeader
          title="Statistics"
          description="Managing the community ecosystem for rewards statistics."
        />
        <ErrorState onRetry={refetchData} title="Failed to load statistics data" />
      </>
    );

  if (!data || !data?.data) return null;

  return (
    <div id="statistics" className="space-y-8">
      <PageHeader
        title="Statistics"
        description="Managing the community ecosystem for rewards statistics."
      />

      {/* Cards */}
      <StatisticsCard
        totalPointsEarned={data.data.totalPointsEarned}
        totalPointsRedeemed={data.data.totalPointsRedeemed}
        totalActivePoints={data.data.totalActivePoints}
      />

      {/* Charts */}
      <StatisticsCharts
        last6MonthsTrend={data.data.last6MonthsTrend}
        materialsCollection={data.data.materialsCollection}
      />

      {/* Table */}
      <StatisticsRanking topContributors={data.data.topContributors} />
    </div>
  );
};

export default Statistics;
