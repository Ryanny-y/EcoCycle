import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const LowStockAlert = ({
  lowStockRewardsCount,
}: {
  lowStockRewardsCount: number;
}) => {
  return (
    lowStockRewardsCount > 0 && (
      <Card className="py-0 bg-red-50">
        <CardContent className="p-5 text-red-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-md">
              <AlertTriangle size={24} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Low Stock Rewards</h3>
              <p className="text-sm text-red-800">
                {lowStockRewardsCount} items in the inventory are running low on
                stock.
              </p>
            </div>
          </div>

          <Button size={"sm"} className="bg-red-700">
            Manage Inventory
          </Button>
        </CardContent>
      </Card>
    )
  );
};

export default LowStockAlert;
