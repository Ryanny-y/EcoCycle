import { Card, CardContent } from "@/components/ui/card";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";

type StatisticsCardProps = {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalActivePoints: number;
}

const StatisticsCard = ({ totalPointsEarned, totalPointsRedeemed, totalActivePoints }: StatisticsCardProps) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <Card>
        <CardContent className="flex items-start gap-3">
          <div className="p-2.5 bg-green-50 rounded-md mb-2">
            <TrendingUp size={28} strokeWidth={2} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground/80 uppercase">
              Total Points Earned
            </p>
            <p className="font-bold text-2xl tracking-tighter">{totalPointsEarned}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3">
          <div className="p-2.5 bg-yellow-50 rounded-md mb-2">
            <TrendingDown
              size={28}
              strokeWidth={2}
              className="text-yellow-500"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground/80 uppercase">
              TOTAL Points Redeemed
            </p>
            <p className="font-bold text-2xl tracking-tighter">{totalPointsRedeemed}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-50 rounded-md mb-2">
            <Coins size={28} strokeWidth={2} className="text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground/80 uppercase">
              Points In Circulation
            </p>
            <p className="font-bold text-2xl tracking-tighter">{totalActivePoints}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCard;
