import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MATERIALS } from "@/constants";
import { formatName } from "@/lib/utils";
import type { RecordInterface } from "@/types/dto";
import type { Dispatch, SetStateAction } from "react";

const Step3 = ({
  selectedRecord,
  totalWeight,
  totalPoints,
  materialWeights,
  setStep,
}: {
  selectedRecord: RecordInterface | null;
  totalWeight: number;
  totalPoints: number;
  materialWeights: Record<string, number>;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  if (!selectedRecord) return;

  const materials = Object.entries(materialWeights).filter(
    ([_, w]) => Number(w) > 0,
  );

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
          {materials.map(([id, weight]) => {
            const material = MATERIALS.find((mat) => mat.id === id);
            return (
              <div
                key={id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-stone-600">
                  {material?.name} ({weight}
                  {material?.unit})
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
            <span className="font-black text-primary">
              +{totalPoints} pts
            </span>
          </div>
        </div>

      </CardContent>

      <CardFooter className="sm:min-w-sm mx-auto px-0  grid gap-5">
        <Button className="w-full py-7 text-lg shadow-lg shadow-primary/50">Confirm Points</Button>
        <Button className="text-muted-foreground" variant={"ghost"} onClick={() => setStep(2)}>Back to materials</Button>
      </CardFooter>
    </>
  );
};

export default Step3;