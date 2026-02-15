import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Material } from "@/types/dto";
import { Minus, Plus, Scale } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const Step2 = ({
  materials,
  setStep,
  materialWeights,
  totalWeight,
  setMaterialWeights,
}: {
  materials: Material[] | undefined
  setStep: Dispatch<SetStateAction<number>>;
  materialWeights: Record<string, number>;
  totalWeight: number;
  setMaterialWeights: Dispatch<SetStateAction<Record<string, number>>>;
}) => {
  const handleWeightChange = (materialId: string, weight: number) => {
    setMaterialWeights((prev) => ({
      ...prev,
      [materialId]: Math.max(0, weight),
    }));
  };

  return (
    <>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg md:text-xl font-bold">
          Recyclables List
        </CardTitle>
        <CardDescription className="flex items-center">
          <Scale className="mr-1" size={18} /> Enter weight in Kilograms (kg)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {materials?.map((material) => (
            <div
              key={material.id}
              className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                (materialWeights[material.id] || 0) > 0
                  ? "border-primary/50 bg-emerald-50/30"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                    {material.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-primary font-medium">
                    {material.pointsPerKg} points/kg
                  </p>
                </div>
                {(materialWeights[material.id] || 0) > 0 && (
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      +{materialWeights[material.id] * material.pointsPerKg}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  onClick={() =>
                    handleWeightChange(
                      material.id,
                      (materialWeights[material.id] || 0) - 1,
                    )
                  }
                  variant={"outline"}
                >
                  <Minus size={16} />
                </Button>
                <Input
                  type="number"
                  value={materialWeights[material.id] || ""}
                  onChange={(e) =>
                    handleWeightChange(
                      material.id,
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="0.0"
                  className="flex-1 min-w-0 py-2.5 text-center font-bold"
                />
                <Button
                  onClick={() =>
                    handleWeightChange(
                      material.id,
                      (materialWeights[material.id] || 0) + 1,
                    )
                  }
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Button
          variant={"ghost"}
          onClick={() => setStep(1)}
          className="text-muted-foreground"
        >
          Back
        </Button>
        <Button
          size={"xl"}
          disabled={totalWeight === 0}
          onClick={() => setStep(3)}
        >
          Review Summary
        </Button>
      </CardFooter>
    </>
  );
};

export default Step2;
