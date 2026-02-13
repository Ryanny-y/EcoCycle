import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useRewardItems from "@/contexts/RewardItemsContext";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

const RewardItemsGrid = () => {
  const { data, loading } = useRewardItems();

  // if(loading) 

  if(data?.data?.length === 0) {
    return <p>No Items</p>
  }

  if(!data) return;

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
      {data.data?.map(item => (
        <Card className="pt-0 gap-2 group">
          <div className="relative h-44 rounded-t-xl overflow-hidden">
            <img
              src={item.imageUrl}
              alt="Reward Item Image"
              className="h-full w-full group-hover:scale-105 duration-300"
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

            <Badge className="absolute z-20 bottom-3 left-3 bg-gray-700">
              {item.mainCategory === "AGRICULTURAL" ? "Agricultural" : "Non-Agricultural"}
            </Badge>
          </div>

          <CardContent className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-xl">{item.name}</h1>
              <p className="text-primary font-bold text-lg">{item.requiredPoints} pts</p>
            </div>
            <p className="text-muted-foreground text-sm">
              {item.description}
            </p>
          </CardContent>

          <CardFooter className="px-4 mt-5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              Available Stocks:{" "}
              <span className="font-bold text-black text-base">{item.stocks}</span>
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RewardItemsGrid;
