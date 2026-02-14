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
import useDebounce from "@/hooks/useDebounce";
import { Grid2X2, List, Plus, Search } from "lucide-react";
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
  const [searchInput, setSearchInput] = useState("");

  const debouncedValue = useDebounce(searchInput, 500);
  // useEffect(() => {
  //   setSearch(debouncedValue);
  // }, [debouncedValue, setSearch]);

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
            // defaultValue={mainCategory ?? " "}
            // onValueChange={(val) =>
            //   setMainCategory(val)
            // }
            >
              <SelectTrigger className="w-full h-full! min-w-48">
                <SelectValue placeholder="Select Sort Option" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="NEWEST">Newest</SelectItem>
                  <SelectItem value="NAME">Name (A-Z)</SelectItem>
                  <SelectItem value="POINTS_ASC">
                    Points (Low to High)
                  </SelectItem>
                  <SelectItem value="POINTS_DESC">
                    Points (High to Low)
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
