import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/SkeletonLoadings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RewardItem } from "@/types/dto";
import { Boxes, Edit, MoreVertical, Trash2 } from "lucide-react";

type RewardItemsTableProps = {
  rewardItemsData: {
    rewardItems: RewardItem[] | undefined;
    loading: boolean;
    error: string | null;
    refetchData: () => void;
  };
  openEditReward: (rewardItem: RewardItem) => void;
  openDeleteReward: (rewardItem: RewardItem) => void;
};

const RewardItemsTable = ({
  rewardItemsData,
  openEditReward,
  openDeleteReward,
}: RewardItemsTableProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  if (rewardItemsData.loading) return <TableSkeleton headLength={5} />;

  if (rewardItemsData.error) {
    return (
      <ErrorState
        title="Failed to load Reward Items"
        onRetry={rewardItemsData.refetchData}
      />
    );
  }

  if (!rewardItemsData.rewardItems || rewardItemsData.rewardItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-2">
        <Boxes className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-semibold">No Reward Items available</p>
        <p className="text-sm text-gray-500">
          It looks like there are no reward items at the moment. Check back
          later or add new reward items!
        </p>
      </div>
    );
  }
  const { rewardItems } = rewardItemsData;

  return (
    <div className="custom-scroll rounded-xl max-h-150">
      <Table id="reward_items_table">
        <TableHeader className="bg-primary rounded-xl">
          <TableRow className="hover:bg-primary">
            <TableHead className="flex items-center text-white gap-2 py-6">
              REWARD
            </TableHead>
            <TableHead className="text-white">CATEGORY</TableHead>
            <TableHead className="text-white text-center">STOCK</TableHead>
            <TableHead className="text-white text-center">
              REQUIRED POINTS
            </TableHead>
            <TableHead className="text-white text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rewardItems.map((reward) => {
            return (
              <TableRow
                key={reward.id}
                className="cursor-pointer hover:bg-emerald-50/50"
              >
                <TableCell className="font-semibold max-w-70 pr-10! overflow-hidden">
                  <div className="flex gap-5 items-center">
                    <div className="h-12 w-12 rounded-lg shrink-0">
                      <img
                        src={`${STORAGE_URL}/${reward.imageUrl}`}
                        alt="Reward Item Image"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-xl">{reward.name}</p>
                      <p className="truncate text-muted-foreground text-xs overflow-hidden">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${reward.mainCategory === "AGRICULTURAL" ? "bg-primary text-white" : "bg-gray-700"}`}
                  >
                    {reward.mainCategory}
                  </Badge>
                </TableCell>
                <TableCell className="text-center ">
                  <div
                    className={`${reward.stocks <= 5 && "text-destructive"} font-bold`}
                  >
                    <p>{reward.stocks}</p>
                    {reward.stocks <= 5 && (
                      <p className="text-[10px] font-medium">LOW STOCK</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center text-primary text-lg font-bold">
                  {reward.requiredPoints}{" "}
                  {reward.requiredPoints > 1 ? "Points" : "Point"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="rounded-full "
                        onClick={() => openEditReward(reward)}
                      >
                        <Edit className="mr-0.5 h-4 w-4" />
                        Edit Reward Item
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive rounded-full group hover:text-destructive!"
                        onClick={() => openDeleteReward(reward)}
                      >
                        <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                        Delete Reward Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RewardItemsTable;
