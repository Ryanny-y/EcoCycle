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
import useMaterials from "@/contexts/MaterialsContext";
import type { SortField } from "@/contexts/types/MaterialsTypes";
import useDebounce from "@/hooks/useDebounce";
import { ArrowUpDown, Grid2X2, List, Plus, Search } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type RewardItemsHeaderProps = {
  materialsLayout: "GRID" | "TABLE";
  handleSetLayout: (value: "GRID" | "TABLE") => void;
  setIsAddMaterialModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MaterialsHeader = ({
  materialsLayout,
  handleSetLayout,
  setIsAddMaterialModalOpen,
}: RewardItemsHeaderProps) => {
  const { sortField, setSearch, setSortField, sortOrder, setSortOrder } =
    useMaterials();
  const [searchInput, setSearchInput] = useState("");

  const debouncedValue = useDebounce(searchInput, 500);
  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  const handleChangeSortOrder = () => {
    if (sortOrder === "DESC") setSortOrder("ASC");
    if (sortOrder === "ASC") setSortOrder("DESC");
  };

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
              placeholder="Search reward items"
            />
          </div>

          {/* Category */}
          <div>
            <Select
              defaultValue={sortField}
              onValueChange={(val: SortField) => setSortField(val)}
            >
              <SelectTrigger className="w-full h-full! min-w-48">
                <SelectValue placeholder="Select Sort Option" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="pointsPerKg">Points</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={"outline"}
            className="group bg-white! h-full hover:bg-muted! active:bg-muted/80!"
            onClick={handleChangeSortOrder}
          >
            <span>Sort</span>
            <ArrowUpDown />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg gap-1 p-1 bg-gray-200">
            <Button
              variant={"ghost"}
              className={`${materialsLayout === "GRID" && "bg-white!"}`}
              size={"icon-sm"}
              onClick={() => handleSetLayout("GRID")}
            >
              <Grid2X2 />
            </Button>
            <Button
              variant={"ghost"}
              className={`${materialsLayout === "TABLE" && "bg-white!"}`}
              size={"icon-sm"}
              onClick={() => handleSetLayout("TABLE")}
            >
              <List />
            </Button>
          </div>
          <Button onClick={() => setIsAddMaterialModalOpen(true)}>
            <Plus /> Add New Material
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsHeader;
