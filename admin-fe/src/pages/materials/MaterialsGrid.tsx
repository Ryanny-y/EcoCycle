import { ErrorState } from "@/components/shared/ErrorState";
import { GridCardSkeleton } from "@/components/shared/SkeletonLoadings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Material } from "@/types/dto";
import { truncateSentence } from "@/utils/formatter";
import dayjs from "dayjs";
import { Box, MoreVertical, Pencil, Scale, Trash2 } from "lucide-react";

type MaterialsGridProps = {
  materialsData: {
    materials: Material[] | undefined;
    loading: boolean;
    error: string | null;
    refetchData: () => Promise<void>;
  };
  openEditMaterial: (material: Material) => void;
  openDeleteMaterial: (material: Material) => void;
};

const MaterialsGrid = ({
  materialsData,
  openEditMaterial,
  openDeleteMaterial,
}: MaterialsGridProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  if (materialsData.loading) return <GridCardSkeleton />;

  if (materialsData.error) {
    return (
      <ErrorState
        title="Failed to load Materials"
        onRetry={materialsData.refetchData}
      />
    );
  }

  if (!materialsData.materials || materialsData.materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground space-y-2">
        <Box className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-semibold">No Materials available</p>
        <p className="text-sm text-gray-500">
          It looks like there are no materials at the moment. Check back
          later or add new materials!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
      {materialsData.materials.map((material) => (
        <Card key={material.id} className="pt-0 gap-2 group">
          <div className="relative h-44 rounded-t-xl overflow-hidden">
            <img
              src={`${STORAGE_URL}/${material.imageUrl}`}
              alt="Material Item Image"
              className="h-full w-full group-hover:scale-105 duration-300 object-contain object-center"
            />

            <div className="absolute top-3 right-3 z-20 rounded-md text-black">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="rounded-full "
                    onClick={() => openEditMaterial(material)}
                  >
                    <Pencil className="mr-0.5 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive rounded-full group hover:text-destructive!"
                    onClick={() => openDeleteMaterial(material)}
                  >
                    <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardContent className="px-4 space-y-2">
            <h1 className="font-bold text-xl">{material.name}</h1>
            <p className="text-muted-foreground text-sm text-ellipsis max-h-10 overflow-hidden">
              {truncateSentence(material.description)}
            </p>
          </CardContent>

          <CardFooter className="px-4 flex items-center justify-between flex-wrap gap-x-5 mt-auto pt-3">
            <p className="text-sm text-primary font-bold">
              <span>
                <Scale className="inline mr-1" size={18} /> 1kg ={" "}
                {material.pointsPerKg} {material.pointsPerKg > 1 ? "pts" : "pt"}
              </span>
            </p>

            <p className="text-xs text-muted-foreground">
              {dayjs(material.createdAt).format("MM/DD/YYYY")}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MaterialsGrid;
