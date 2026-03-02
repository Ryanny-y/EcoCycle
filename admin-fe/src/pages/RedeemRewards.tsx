import PageHeader from "@/components/shared/PageHeader";
import type { RewardItem } from "@/types/dto";
import { useState } from "react";
import SearchRecord from "./redeemRewards/SearchRecord";
import AvailableRewards from "./redeemRewards/AvailableRewards";
import RedeemModal from "./redeemRewards/RedeemModal";
import useRewardItems from "@/contexts/RewardItemsContext";
import type { PaginatedResponse } from "@/types/api";
import useFetchData from "@/hooks/useFetchData";
import type { IRecord } from "@/types/records.types";

const RedeemRewards = () => {
  const [selectedRecord, setSelectedRecord] = useState<IRecord | null>(null);
  const [search, setSearch] = useState<string>("");

  // Records and Rewards
  const {
    data: records,
    loading: recordsLoading,
    error: recordsErr,
    refetchData: refetchRecord,
  } = useFetchData<PaginatedResponse<IRecord>>(
    `records?search=${search}`,
  );

  const {
    data: rewards,
    loading: rewardsLoading,
    error: rewardsErr,
    refetchData: refetchRewards,
  } = useRewardItems();

  // Modals
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [rewardToRedeem, setRewardToRedeem] = useState<RewardItem | null>(null);

  return (
    <div id="redeem_points" className="space-y-8">
      <PageHeader
        title="Redeem Points"
        description="Redeem accumulated points for community products and rewards"
      />

      {/* Search */}
      <SearchRecord
        recordsData={{
          records: records?.content,
          loading: recordsLoading,
          error: recordsErr,
          refetchData: refetchRecord,
        }}
        setSearch={setSearch}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      />

      {/* Available Rewards */}
      {selectedRecord && (
        <AvailableRewards
          rewardsData={{
            rewards: rewards?.data,
            loading: rewardsLoading,
            error: rewardsErr,
            refetchData: refetchRewards,
          }}
          selectedRecord={selectedRecord}
          setRewardToRedeem={setRewardToRedeem}
          setIsRedeemModalOpen={setIsRedeemModalOpen}
        />
      )}

      {/* MODALS */}
      {isRedeemModalOpen && rewardToRedeem && (
        <RedeemModal
          selectedRecord={selectedRecord}
          rewardToRedeem={rewardToRedeem}
          isRedeemModalOpen={isRedeemModalOpen}
          setIsRedeemModalOpen={setIsRedeemModalOpen}
          refetchRewards={refetchRewards}
          refetchRecord={refetchRecord}
        />
      )}
    </div>
  );
};

export default RedeemRewards;
