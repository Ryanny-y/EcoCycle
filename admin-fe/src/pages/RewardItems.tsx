import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import RewardItemsHeader from "./rewardItems/RewardItemsHeader";
import RewardItemsGrid from "./rewardItems/RewardItemsGrid";
import AddRewardItemModal from "./rewardItems/AddRewardItemModal";
import RewardItemsTable from "./rewardItems/RewardItemsTable";
import useRewardItems from "@/contexts/RewardItemsContext";
import { Card, CardContent } from "@/components/ui/card";

const RewardItems = () => {
  const [rewardItemsLayout, setRewardItemsLayout] = useState<"GRID" | "TABLE">(() => {
    const stored = localStorage.getItem("rewardItemsLayout");
    return stored ? JSON.parse(stored) : "GRID";
  });
  const { data, loading, error } = useRewardItems();

  const [isAddRewardModalOpen, setIsAddRewardModalOpen] =
    useState<boolean>(false);

  const handleSetLayout = (value: "GRID" | "TABLE") => {
    setRewardItemsLayout(value);
    localStorage.setItem("rewardItemsLayout", JSON.stringify(value));
  }

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Reward Items"
        description="Manage reward items to exhange for points"
      />

      {/* Search */}
      <RewardItemsHeader
        setIsAddRewardModalOpen={setIsAddRewardModalOpen}
        rewardItemsLayout={rewardItemsLayout}
        handleSetLayout={handleSetLayout}
      />

      {/* Items */}
      {rewardItemsLayout === "GRID" ? (
        <RewardItemsGrid data={data} loading={loading} error={error} />
      ) : (
        <Card>
          <CardContent>
            <RewardItemsTable data={data} loading={loading} error={error} />
          </CardContent>
        </Card>
      )}

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
