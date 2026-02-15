import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { RecordInterface, RewardItem } from "@/types/dto";
import { AlertCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

type RedeemModalTypes = {
  selectedRecord: RecordInterface | null;
  rewardToRedeem: RewardItem | null;
  isRedeemModalOpen: boolean;
  setIsRedeemModalOpen: Dispatch<SetStateAction<boolean>>;
  refetchRewards: () => Promise<void>
  refetchRecord: () => Promise<void>
};

const RedeemModal = ({
  selectedRecord,
  rewardToRedeem,
  isRedeemModalOpen,
  setIsRedeemModalOpen,
  refetchRewards,
  refetchRecord
}: RedeemModalTypes) => {
  if (!rewardToRedeem || !selectedRecord) return;
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { execute } = useMutation();

  // Calculations
  const totalPointCost = rewardToRedeem
    ? rewardToRedeem.requiredPoints * quantity
    : 0;
  const canRedeem = selectedRecord.points >= totalPointCost;
  const hasEnoughStock = rewardToRedeem.stocks >= quantity;

  const confirmRedemption = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response: ApiResponse<any> = await execute(
        `rewards/redeem/${selectedRecord.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            exchangeItemId: rewardToRedeem.id,
            quantity: quantity,
          }),
        },
      );

      toast.success(response.message);
      await refetchRewards();
      await refetchRecord();
      setIsRedeemModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
      <DialogContent showCloseButton={false} className="max-h-170! gap-3">
        <DialogHeader className="flex items-center justify-center gap-3">
          <span className="bg-emerald-100 p-5 rounded-full">
            <ShoppingBag className="text-emerald-700" size={36} />
          </span>
          <DialogTitle className="font-[660] text-2xl">
            Confirm Redemption
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            Redeeming{" "}
            <span className="font-bold text-foreground">
              {rewardToRedeem.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* QUANTITY */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <span className="text-sm font-bold text-gray-600 block leading-none">
                Select Quantity
              </span>
              <span className="text-[10px] text-gray-400">
                Available: {rewardToRedeem.stocks} pc
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-bold w-6">{quantity}</span>
              <button
                disabled={quantity >= rewardToRedeem.stocks}
                onClick={() => setQuantity((prev) => prev + 1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                  quantity >= rewardToRedeem.stocks
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full mb-4"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">
              Total Points Cost
            </span>
            <span
              className={`text-xl font-black ${canRedeem ? "text-emerald-600" : "text-red-500"}`}
            >
              {totalPointCost} pts
            </span>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-gray-50/50 rounded-xl p-4 mb-8 flex justify-between items-center text-sm font-medium">
          <div className="text-left">
            <p className="text-gray-400">Current Points</p>
            <p className="text-gray-900">{selectedRecord?.points} pts</p>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-right">
            <p className="text-gray-400">After Redemption</p>
            <p
              className={`${canRedeem ? "text-emerald-600" : "text-red-400"} font-bold`}
            >
              {(selectedRecord?.points || 0) - totalPointCost} pts
            </p>
          </div>
        </div>

        {!canRedeem && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-xs font-bold justify-center">
            <AlertCircle size={16} />
            Insufficient points for this quantity
          </div>
        )}

        <div className="flex gap-3">
          <button
            disabled={isProcessing}
            onClick={() => setIsRedeemModalOpen(false)}
            className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isProcessing || !canRedeem || !hasEnoughStock}
            onClick={confirmRedemption}
            className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              canRedeem && hasEnoughStock
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isProcessing ? <><span className="flex"><Spinner /></span> Redeeming</> : "Yes, Confirm"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RedeemModal;
