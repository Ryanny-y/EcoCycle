import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiResponse } from "@/types/api";
import type { Material } from "@/types/dto";
import dayjs from "dayjs";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

type MaterialsTableProps = {
  data: ApiResponse<Material[]> | null;
  loading: boolean;
  error: string | null;
  openEditMaterial: (material: Material) => void;
  openDeleteMaterial: (material: Material) => void;
};

const MaterialsTable = ({
  data,
  loading,
  error,
  openEditMaterial,
  openDeleteMaterial,
}: MaterialsTableProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  if (!data?.data) return;

  const materials = data.data;

  return (
    <div className="custom-scroll rounded-xl max-h-150">
      <Table id="reward_items_table">
        <TableHeader className="bg-primary rounded-xl">
          <TableRow className="hover:bg-primary">
            <TableHead className="flex items-center text-white gap-2 py-6">
              Material
            </TableHead>
            <TableHead className="text-white text-center">
              Points per Kilogram
            </TableHead>
            <TableHead className="text-white text-center">
              Added At
            </TableHead>
            <TableHead className="text-white text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            return (
              <TableRow
                key={material.id}
                className="cursor-pointer hover:bg-emerald-50/50"
              >
                <TableCell className="font-semibold max-w-70 pr-10! overflow-hidden">
                  <div className="flex gap-5 items-center">
                    <div className="h-12 w-12 rounded-lg shrink-0">
                      <img
                        src={`${STORAGE_URL}/${material.imageUrl}`}
                        alt="material Item Image"
                        className="w-full h-full object-contain object-center"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-xl">{material.name}</p>
                      <p className="truncate text-muted-foreground text-xs overflow-hidden">
                        {material.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-primary text-lg font-bold">
                  {material.pointsPerKg}{" "}
                  {material.pointsPerKg > 1 ? "Points" : "Point"}
                </TableCell>
                <TableCell className="text-center text-base">{dayjs(material.createdAt).format("MMM DD, YYYY")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="rounded-full "
                        onClick={() => openEditMaterial(material)}
                      >
                        <Edit className="mr-0.5 h-4 w-4" />
                        Edit Material
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive rounded-full group hover:text-destructive!"
                        onClick={() => openDeleteMaterial(material)}
                      >
                        <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                        Delete Material
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaterialsTable;
