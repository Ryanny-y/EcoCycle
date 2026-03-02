import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import useMutation from "@/hooks/useMutation";
import type { ApiResponse } from "@/types/api";
import type { Material } from "@/types/dto";
import type { IRecord } from "@/types/records.types";
import { formatName } from "@/utils/formatter";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";


type Step3Props = {
  materials: Material[] | undefined;
  selectedRecord: IRecord | null;
  setSelectedRecord: Dispatch<SetStateAction<IRecord | null>>; 
  totalWeight: number;
  totalPoints: number;
  materialWeights: Record<string, number>;
  setStep: Dispatch<SetStateAction<number>>;
}

const Step3 = ({
  materials,
  selectedRecord,
  setSelectedRecord,
  totalWeight,
  totalPoints,
  materialWeights,
  setStep,
}: Step3Props) => {
  if (!selectedRecord) return;
  const [isConfirming, setIsConfirming] = useState(false);
  const { execute } = useMutation();

  const materialInputs = Object.entries(materialWeights).filter(
    ([_, w]) => Number(w) > 0,
  );

  const handleConfirmPoints = async () => {
    if (isConfirming) return;

    setIsConfirming(true);
    const transformedMaterialInputs = materialInputs?.map(([id, weight]) => ({
      id,
      weight,
    }));

    try {
      const response: ApiResponse<any> = await execute(
        `rewards/earn/${selectedRecord.id}`,
        {
          method: "POST",
          body: JSON.stringify({ materials: transformedMaterialInputs }),
        },
      );

      toast.success(response.message);
      setStep(1);
      setSelectedRecord(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-bold">Summary</CardTitle>
        <CardDescription>Review Summary to confirm points</CardDescription>
      </CardHeader>

      <CardContent className="mx-auto bg-gray-50 p-5 rounded-lg border text-center sm:min-w-sm space-y-4">
        {/* Contributor */}
        <div>
          <h6 className="font-semibold text-muted-foreground text-sm tracking-wider">
            Contributor
          </h6>
          <h1 className="font-bold text-lg">
            {formatName(
              selectedRecord.lastName,
              selectedRecord.firstName,
              selectedRecord.middleName,
            )}
          </h1>
        </div>

        <div className="h-px rounded-full w-full bg-stone-400"></div>

        {/* Materials */}
        <div className="space-y-2">
          {materialInputs.map(([id, weight]) => {
            const material = materials?.find((mat) => mat.id === id);
            return (
              <div
                key={id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-stone-600">
                  {material?.name} {weight}kg
                </span>
                <span className="font-bold text-stone-900">
                  +{weight * (material?.pointsPerKg || 0)} pts
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-px rounded-full w-full bg-stone-400"></div>

        <div className="space-y-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500">Total Weight</span>
            <span className="font-medium">{totalWeight} kg</span>
          </div>
          <div className="flex justify-between items-center text-base sm:text-lg mt-4 border-t border-gray-100">
            <span className="font-bold text-gray-900">Points to Add</span>
            <span className="font-black text-primary">+{totalPoints} pts</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="sm:min-w-sm mx-auto px-0  grid gap-5">
        <Button
          className="w-full py-7 text-lg shadow-lg shadow-primary/50"
          onClick={handleConfirmPoints}
        >
          {!isConfirming ? "Confirm Points" : <Spinner />}
        </Button>
        <Button
          className="text-muted-foreground"
          variant={"ghost"}
          onClick={() => setStep(2)}
        >
          Back to materials
        </Button>
      </CardFooter>
    </>
  );
};

export default Step3;
