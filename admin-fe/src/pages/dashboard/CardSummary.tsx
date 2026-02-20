import { Card, CardContent } from "@/components/ui/card";
import { Boxes, Coins, RefreshCcw, Users } from "lucide-react";

type CardSummaryProps = {
  totalResidents: number;
  totalMaterialsCollected: number;
  totalPointsEarned: number;
  totalRewardsRedeemed: number;
}

const CardSummary = ({ totalResidents, totalMaterialsCollected, totalPointsEarned, totalRewardsRedeemed }:CardSummaryProps ) => {
  return (
    <div className="grid grid-cols-4 gap-5">
      <Card>
        <CardContent className="flex flex-col items-start gap-1">
          <div className="p-2.5 bg-blue-50 rounded-md mb-2">
            <Users size={28} strokeWidth={2} className="text-blue-500" />
          </div>
          <p className="text-xs font-bold text-muted-foreground/80">
            TOTAL RESIDENTS
          </p>
          <p className="font-bold text-2xl tracking-tighter">
            {totalResidents}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-1">
          <div className="p-2.5 bg-green-50 rounded-md mb-2">
            <Boxes size={28} strokeWidth={2} className="text-green-500" />
          </div>
          <p className="text-xs font-bold text-muted-foreground/80">
            TOTAL MATERIALS
          </p>
          <p className="font-bold text-2xl tracking-tighter">
            {totalMaterialsCollected} kg
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-1">
          <div className="p-2.5 bg-yellow-50 rounded-md mb-2">
            <Coins size={28} strokeWidth={2} className="text-yellow-500" />
          </div>
          <p className="text-xs font-bold text-muted-foreground/80">
            TOTAL POINTS EARNED
          </p>
          <p className="font-bold text-2xl tracking-tighter">
            {totalPointsEarned}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-1">
          <div className="p-2.5 bg-purple-50 rounded-md mb-2">
            <RefreshCcw size={28} strokeWidth={2} className="text-purple-500" />
          </div>
          <p className="text-xs font-bold text-muted-foreground/80">
            REWARDS REDEEMED
          </p>
          <p className="font-bold text-2xl tracking-tighter">
            {totalRewardsRedeemed}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardSummary;
