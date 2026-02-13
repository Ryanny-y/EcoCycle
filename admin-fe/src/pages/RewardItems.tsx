import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import RewardItemsHeader from "./rewardItems/RewardItemsHeader";
import RewardItemsGrid from "./rewardItems/RewardItemsGrid";
import AddRewardItemModal from "./rewardItems/AddRewardItemModal";

const RewardItems = () => {
  const [isGrid, setIsGrid] = useState(true);

  const [isAddRewardModalOpen, setIsAddRewardModalOpen] =
    useState<boolean>(false);

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Reward Items"
        description="Manage reward items to exhange for points"
      />

      {/* Search */}
      <RewardItemsHeader setIsAddRewardModalOpen={setIsAddRewardModalOpen} />

      {/* Items */}
      {isGrid ? <RewardItemsGrid /> : <p></p>}

      {isAddRewardModalOpen && (
        <AddRewardItemModal
          isAddRewardModalOpen={isAddRewardModalOpen}
          setIsAddRewardModalOpen={setIsAddRewardModalOpen}
        />
      )}
    </div>
  );
};

export default RewardItems;
