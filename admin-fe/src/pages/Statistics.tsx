import PageHeader from "@/components/shared/PageHeader";

import StatisticsCard from "./statistics/StatisticsCard";
import StatisticsCharts from "./statistics/StatisticsCharts";
import StatisticsRanking from "./statistics/StatisticsRanking";


const Statistics = () => {
  return (
    <div id="statistics" className="space-y-8">
      <PageHeader
        title="Statistics"
        description="Managing the community ecosystem for trading statistics."
      />

      {/* Cards */}
      <StatisticsCard />    

      {/* Charts */}
      <StatisticsCharts />

      {/* Table */}
      <StatisticsRanking />
    </div>
  );
};

export default Statistics;
