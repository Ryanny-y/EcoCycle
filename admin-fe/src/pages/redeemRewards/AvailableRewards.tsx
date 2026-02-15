import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useRewardItems from "@/contexts/RewardItemsContext";
import type { RecordInterface } from "@/types/dto";
import { ShoppingBag } from "lucide-react";

type AvailableRewardsProps = {
  selectedRecord: RecordInterface;
};

const AvailableRewards = ({ selectedRecord }: AvailableRewardsProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;
  const { data } = useRewardItems();

  const availableRewards = data?.data?.filter(
    (reward) => reward.requiredPoints <= selectedRecord.points,
  );

  return (
    <div
      id="available_items"
      className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5"
    >
      {availableRewards?.map((reward) => (
        <Card className="pt-0 gap-3">
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
              <p className={`font-bold ${reward.stocks <= 5 && "text-destructive"}`}>
                {reward.stocks}{" "}
                <span className={`lowercase font-semibold`}>
                  {reward.stocks > 1 ? `${reward.unit}s` : reward.unit}
                </span>
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full py-5"><ShoppingBag />Redeem Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRewards;
