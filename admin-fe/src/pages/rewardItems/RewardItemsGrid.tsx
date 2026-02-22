import { ErrorState } from "@/components/shared/ErrorState";
import { GridCardSkeleton } from "@/components/shared/SkeletonLoadings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RewardItem } from "@/types/dto";
import { truncateSentence } from "@/utils/formatter";
import {
  Boxes,
  MoreVertical,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";

type RewardItemsGridProps = {
  rewardItemsData: {
    rewardItems: RewardItem[] | undefined;
    loading: boolean;
    error: string | null;
    refetchData: () => void;
  };
  openEditReward: (rewardItem: RewardItem) => void;
  openDeleteReward: (rewardItem: RewardItem) => void;
};

const RewardItemsGrid = ({
  rewardItemsData,
  openEditReward,
  openDeleteReward,
}: RewardItemsGridProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  if (rewardItemsData.loading) return <GridCardSkeleton />;

  if (rewardItemsData.error) {
    return (
      <ErrorState
        title="Failed to load reward items"
        onRetry={rewardItemsData.refetchData}
      />
    );
  }

  if (
    !rewardItemsData.rewardItems ||
    rewardItemsData.rewardItems.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-2">
        <Boxes className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-semibold">No reward items available</p>
        <p className="text-sm text-gray-500">
          It looks like there are no reward items at the moment. Check back
          later or add new rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
      {rewardItemsData.rewardItems.map((reward) => (
        <Card key={reward.id} className="pt-0 gap-2 group">
          <div className="relative h-44 rounded-t-xl overflow-hidden">
            <img
              src={`${STORAGE_URL}/${reward.imageUrl}`}
              alt="Reward Item Image"
              className="h-full w-full group-hover:scale-105 duration-300 object-contain object-center"
            />

            <div className="absolute top-3 right-3 z-20 rounded-md text-black">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="rounded-full "
                    onClick={() => openEditReward(reward)}
                  >
                    <Pencil className="mr-0.5 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive rounded-full group hover:text-destructive!"
                    onClick={() => openDeleteReward(reward)}
                  >
                    <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Badge
              className={`absolute z-20 bottom-3 left-3 ${reward.mainCategory === "AGRICULTURAL" ? "bg-primary text-white" : "bg-gray-700"}`}
            >
              {reward.mainCategory}
            </Badge>
          </div>

          <CardContent className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl">{reward.name}</h1>
              <p className="text-primary font-bold text-lg">
                {reward.requiredPoints} pts
              </p>
            </div>
            <p className="text-muted-foreground text-sm text-ellipsis max-h-10 overflow-hidden">
              {truncateSentence(reward.description)}
            </p>
          </CardContent>

          <CardFooter className="px-4 mt-5 flex items-center justify-between flex-wrap gap-x-5">
            <p className="text-xs font-semibold text-muted-foreground">
              Available Stocks:{" "}
              <span
                className={`font-bold ${reward.stocks <= 5 ? "text-destructive" : "text-black"} text-base`}
              >
                {reward.stocks} {reward.unit}
              </span>
            </p>

            {reward.stocks <= 5 && (
              <p className="flex gap-1 text-xs text-red-500">
                <TriangleAlert size={14} /> LOW
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RewardItemsGrid;
