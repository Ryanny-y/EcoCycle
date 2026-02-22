import PageHeader from "@/components/shared/PageHeader";

import StatisticsCard from "./statistics/StatisticsCard";
import StatisticsCharts from "./statistics/StatisticsCharts";
import StatisticsRanking from "./statistics/StatisticsRanking";
import useFetchData from "@/hooks/useFetchData";
import type { RewardStatisticsResponse } from "@/types/dto";
import type { ApiResponse } from "@/types/api";

const Statistics = () => {
  const { data, loading, error } =
    useFetchData<ApiResponse<RewardStatisticsResponse>>("rewards/statistics");

  if (!data || !data?.data) return null;

  return (
    <div id="statistics" className="space-y-8">
      <PageHeader
        title="Statistics"
        description="Managing the community ecosystem for trading statistics."
      />

      {/* Cards */}
      <StatisticsCard
        totalPointsEarned={data.data.totalPointsEarned}
        totalPointsRedeemed={data.data.totalPointsRedeemed}
        totalActivePoints={data.data.totalActivePoints}
      />

      {/* Charts */}
      <StatisticsCharts last6MonthsTrend={data.data.last6MonthsTrend}/>

      {/* Table */}
      <StatisticsRanking />
    </div>
  );
};

export default Statistics;
