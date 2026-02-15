import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import type { RecordInterface } from "@/types/dto";
import { CheckCircle2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import Step1 from "./earnPoints/Step1";
import Step2 from "./earnPoints/Step2";
import Step3 from "./earnPoints/Step3";
import useMaterials from "@/contexts/MaterialsContext";

const EarnPoints = () => {
  const [step, setStep] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<RecordInterface | null>(
    null,
  );
  const { data, loading: materialsLoading, error: materialsErr, refetchData } = useMaterials();
  const [materialWeights, setMaterialWeights] = useState<
    Record<string, number>
  >({});

  // Handle the case where data is null

  const totalWeight: number = useMemo(() => {
    return Object.values(materialWeights).reduce(
      (total: number, weight: number) => total + weight,
      0,
    );
  }, [materialWeights]);

  const totalPoints: number = useMemo(() => {
    return Object.entries(materialWeights).reduce((total, [id, weight]) => {
      const material = data?.data?.find((material) => material.id === id);
      return total + Number(weight) * (material?.pointsPerKg || 0);
    }, 0);
  }, [materialWeights]);

  return (
    <div id="earn_points" className="space-y-8">
      <PageHeader
        title="Earn Points"
        description="Accumulate points for recycling records"
      />

      <div className="flex items-center justify-between mb-8 sm:mb-10 px-2 sm:px-4 max-w-3xl">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                  step >= s
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? (
                  <CheckCircle2 size={16} className="sm:size-5" />
                ) : (
                  s
                )}
              </div>

              <span
                className={`text-[9px] sm:text-xs font-semibold uppercase tracking-wider hidden xs:block ${step >= s ? "text-emerald-700" : "text-gray-400"}`}
              >
                {s === 1 ? "Find" : s === 2 ? "Add" : "Review"}
              </span>
            </div>

            {s < 3 && (
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-4 ${step > s ? "bg-primary" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="max-w-3xl">
        {step === 1 && (
          <Step1
            setSelectedRecord={setSelectedRecord}
            selectedRecord={selectedRecord}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <Step2
            materialsData={{
              materials: data?.data,
              loading: materialsLoading,
              error: materialsErr,
              refetchMaterials: refetchData
            }}
            setStep={setStep}
            totalWeight={totalWeight}
            materialWeights={materialWeights}
            setMaterialWeights={setMaterialWeights}
          />
        )}
        {step === 3 && (
          <Step3
            materials={data?.data}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            totalWeight={totalWeight}
            totalPoints={totalPoints}
            materialWeights={materialWeights}
            setStep={setStep}
          />
        )}
      </Card>
    </div>
  );
};

export default EarnPoints;
