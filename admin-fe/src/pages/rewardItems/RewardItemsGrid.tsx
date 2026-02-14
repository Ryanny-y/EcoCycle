import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiResponse } from "@/types/api";
import type { RewardItem } from "@/types/dto";
import { truncateSentence } from "@/utils/formatter";
import { MoreVertical, Pencil, Trash2, TriangleAlert } from "lucide-react";

type RewardItemsGridProps = {
  data: ApiResponse<RewardItem[]> | null;
  loading: boolean;
  error: string | null;
};

const RewardItemsGrid = ({ data, loading, error }: RewardItemsGridProps) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_BASE_URL;

  if (!data) return;

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
      {data.data?.map((item) => (
        <Card key={item.id} className="pt-0 gap-2 group">
          <div className="relative h-44 rounded-t-xl overflow-hidden">
            <img
              src={`${STORAGE_URL}/${item.imageUrl}`}
              alt="Reward Item Image"
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
                    // onClick={() => openEditRecord(record)}
                  >
                    <Pencil className="mr-0.5 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive rounded-full group hover:text-destructive!"
                    // onClick={() => openDeleteRecord(record)}
                  >
                    <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Badge className={`absolute z-20 bottom-3 left-3 ${item.mainCategory === "AGRICULTURAL" ? "bg-primary text-white" : "bg-gray-700"}`}>
              {item.mainCategory}
            </Badge>
          </div>

          <CardContent className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl">{item.name}</h1>
              <p className="text-primary font-bold text-lg">
                {item.requiredPoints} pts
              </p>
            </div>
            <p className="text-muted-foreground text-sm text-ellipsis max-h-10 overflow-hidden">
              {truncateSentence(item.description)}
            </p>
          </CardContent>

          <CardFooter className="px-4 mt-5 flex items-center justify-between flex-wrap gap-x-5">
            <p className="text-xs font-semibold text-muted-foreground">
              Available Stocks:{" "}
              <span
                className={`font-bold ${item.stocks <= 5 ? "text-destructive" : "text-black"} text-base`}
              >
                {item.stocks} {item.unit}
              </span>
            </p>

            {item.stocks <= 5 && (
              <p className="flex gap-1 text-xs text-red-500">
                <TriangleAlert size={14} /> LOW
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RewardItemsGrid;
