import { ErrorState } from "@/components/shared/ErrorState";
import { RewardCardSkeleton } from "@/components/shared/SkeletonLoadings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { RewardItem } from "@/types/dto";
import type { IRecord } from "@/types/records.types";
import { ShoppingBag } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type AvailableRewardsProps = {
  rewardsData: {
    rewards: RewardItem[] | undefined;
    loading: boolean;
    error: string | null;
    refetchData: () => Promise<void>
  }
  selectedRecord: IRecord;
  setRewardToRedeem: Dispatch<SetStateAction<RewardItem | null>>;
  setIsRedeemModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AvailableRewards = ({
  rewardsData,
  selectedRecord,
  setRewardToRedeem,
  setIsRedeemModalOpen
}: AvailableRewardsProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  // TODO: Check Rewards error or null

  const availableRewards = rewardsData.rewards?.filter(
    (reward) => reward.requiredPoints <= selectedRecord.points,
  );

  const onRedeemClick = (reward: RewardItem) => {
    setRewardToRedeem(reward);
    setIsRedeemModalOpen(true);
  };

  if (rewardsData.loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <RewardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (rewardsData.error) {
    return (
      <Card>
        <CardContent>
          <ErrorState
            title="Failed to load rewards"
            onRetry={rewardsData.refetchData}
            retryLabel="Retry"
          />
        </CardContent>
      </Card>
    );
  }

  if (!availableRewards || availableRewards.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-muted-foreground py-10">
          No rewards available for this resident
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      id="available_items"
      className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5"
    >
      {availableRewards?.map((reward) => (
        <Card key={reward.id} className="pt-0 gap-3">
          <div className="h-40 flex items-center justify-center w-full bg-muted py-5">
            <img
              src={`${STORAGE_URL}/${reward.imageUrl}`}
              alt="Reward Item Image"
              className="w-full h-full object-contain"
            />
          </div>

          <CardContent className="space-y-3">
            <Badge>
              {reward.mainCategory === "AGRICULTURAL"
                ? "Agricultural"
                : "Non-Agricultural"}
            </Badge>
            <div className="text-lg font-bold">
              <h1 className="leading-5">{reward.name}</h1>
              <p className="text-primary">
                {reward.requiredPoints}{" "}
                <span className="text-sm">
                  {reward.requiredPoints > 1 ? "Points" : "Point"}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground">Stock:</p>
              <p
                className={`font-bold ${reward.stocks <= 5 && "text-destructive"}`}
              >
                {reward.stocks}{" "}
                <span className={`lowercase font-semibold`}>
                  {reward.stocks > 1 ? `${reward.unit}s` : reward.unit}
                </span>
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full py-5"
              onClick={() => onRedeemClick(reward)}
            >
              <ShoppingBag />
              Redeem Now
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRewards;
