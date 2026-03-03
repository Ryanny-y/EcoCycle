import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import RewardItemsHeader from "./rewardItems/RewardItemsHeader";
import RewardItemsGrid from "./rewardItems/RewardItemsGrid";
import AddRewardItemModal from "./rewardItems/AddRewardItemModal";
import RewardItemsTable from "./rewardItems/RewardItemsTable";
import useRewardItems from "@/contexts/RewardItemsContext";
import { Card, CardContent } from "@/components/ui/card";
import EditRewardItemModal from "./rewardItems/EditRewardItemModal";
import DeleteRewardItemModal from "./rewardItems/DeleteRewardItemModal";
import type { IRewardItem } from "@/types/rewardItem.types";

const RewardItems = () => {
  const [rewardItemsLayout, setRewardItemsLayout] = useState<"GRID" | "TABLE">(
    () => {
      const stored = localStorage.getItem("rewardItemsLayout");
      return stored ? JSON.parse(stored) : "GRID";
    },
  );
  const { data, loading, error, refetchData } = useRewardItems();

  const handleSetLayout = (value: "GRID" | "TABLE") => {
    setRewardItemsLayout(value);
    localStorage.setItem("rewardItemsLayout", JSON.stringify(value));
  };

  // modals
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);
  const [isEditRewardOpen, setIsEditRewardOpen] = useState(false);
  const [isDeleteRewardOpen, setIsDeleteRewardOpen] = useState(false);

  const [rewardToEdit, setRewardToEdit] = useState<IRewardItem | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<IRewardItem | null>(null);

  const openEditReward = (rewardItem: IRewardItem) => {
    setIsEditRewardOpen(true);
    setRewardToEdit(rewardItem);
  };

  const openDeleteReward = (rewardItem: IRewardItem) => {
    setIsDeleteRewardOpen(true);
    setRewardToDelete(rewardItem);
  };

  return (
    <div id="reward_items" className="space-y-6">
      <PageHeader
        title="Reward Items"
        description="Manage reward items to exchange for points"
      />

      {/* Search and Filters*/}
      <RewardItemsHeader
        setIsAddRewardModalOpen={setIsAddRewardModalOpen}
        rewardItemsLayout={rewardItemsLayout}
        handleSetLayout={handleSetLayout}
      />

      {/* Items */}
      {rewardItemsLayout === "GRID" ? (
        <RewardItemsGrid
          rewardItemsData={{
            rewardItems: data?.data,
            loading: loading,
            error: error,
            refetchData: refetchData,
          }}
          openEditReward={openEditReward}
          openDeleteReward={openDeleteReward}
        />
      ) : (
        <Card>
          <CardContent>
            <RewardItemsTable
              rewardItemsData={{
                rewardItems: data?.data,
                loading: loading,
                error: error,
                refetchData: refetchData,
              }}
              openEditReward={openEditReward}
              openDeleteReward={openDeleteReward}
            />
          </CardContent>
        </Card>
      )}

      {/* MODALS */}
      {isAddRewardModalOpen && (
        <AddRewardItemModal
          isAddRewardModalOpen={isAddRewardModalOpen}
          setIsAddRewardModalOpen={setIsAddRewardModalOpen}
          refetchData={refetchData}
        />
      )}

      {isEditRewardOpen && rewardToEdit && (
        <EditRewardItemModal
          isEditRewardOpen={isEditRewardOpen}
          setIsEditRewardOpen={setIsEditRewardOpen}
          rewardToEdit={rewardToEdit}
          setRewardToEdit={setRewardToEdit}
          refetchData={refetchData}
        />
      )}

      {isDeleteRewardOpen && rewardToDelete && (
        <DeleteRewardItemModal
          isDeleteRewardOpen={isDeleteRewardOpen}
          setIsDeleteRewardOpen={setIsDeleteRewardOpen}
          rewardToDelete={rewardToDelete}
          setRewardToDelete={setRewardToDelete}
          refetchData={refetchData}
        />
      )}
    </div>
  );
};

export default RewardItems;
