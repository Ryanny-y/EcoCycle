import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import RewardItemsHeader from "./rewardItems/RewardItemsHeader";
import RewardItemsGrid from "./rewardItems/RewardItemsGrid";

const RewardItems = () => {

  const [isGrid, setIsGrid] = useState(true);

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Reward Items"
        description="Manage reward items to exhange for points"
      />

      {/* Search */}
      <RewardItemsHeader />

      {/* Items */}
      <RewardItemsGrid />

    </div>
  );
};

export default RewardItems;
