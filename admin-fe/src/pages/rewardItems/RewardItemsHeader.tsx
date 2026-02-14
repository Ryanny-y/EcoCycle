import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RewardItemMainCategory } from "@/types/dto";
import { Grid2X2, List, Plus, Search } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

type RewardItemsHeaderProps = {
  rewardItemsLayout: "GRID" | "TABLE";
  handleSetLayout: (value: "GRID" | "TABLE") => void
  setIsAddRewardModalOpen: Dispatch<SetStateAction<boolean>>;
};

const RewardItemsHeader = ({
  rewardItemsLayout,
  handleSetLayout,
  setIsAddRewardModalOpen,
}: RewardItemsHeaderProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<RewardItemMainCategory | " ">(" ");

  return (
    <Card className="py-4">
      <CardContent className="px-4 flex flex-col gap-5 lg:flex-row flex-wrap justify-between">
        <div className="flex items-stretch gap-2 grow">
          <div className="relative h-10 w-full lg:min-w-90 xl:max-w-90">
            <Search
              size={20}
              className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-3"
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="py-2 pl-10 pr-5 w-full text-base h-full "
              placeholder="Search record to swap points..."
            />
          </div>

          {/* Category */}
          <div>
            <Select
              defaultValue={category}
              onValueChange={(val) =>
                setCategory(val as RewardItemMainCategory | " ")
              }
            >
              <SelectTrigger className="w-full h-full! min-w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value=" ">All Category</SelectItem>
                  <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  <SelectItem value="NON_AGRICULTURAL">
                    Non-Agricultural
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg gap-1 p-1 bg-gray-200">
            <Button
              variant={"ghost"}
              className={`${rewardItemsLayout === "GRID" && "bg-white!"}`}
              size={"icon-sm"}
              onClick={() => handleSetLayout("GRID")}
            >
              <Grid2X2 />
            </Button>
            <Button
              variant={"ghost"}
              className={`${rewardItemsLayout === "TABLE" && "bg-white!"}`}
              size={"icon-sm"}
              onClick={() => handleSetLayout("TABLE")}
            >
              <List />
            </Button>
          </div>
          <Button onClick={() => setIsAddRewardModalOpen(true)}>
            <Plus /> Add New Reward
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardItemsHeader;
