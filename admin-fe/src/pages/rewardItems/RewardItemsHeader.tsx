import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const RewardItemsHeader = () => {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<"AGRICULTURAL" | "NON-NON_AGRICULTURAL" | " ">(" ");

  return (
    <Card className="py-4">
      <CardContent className="px-4 flex justify-between">
        <div className="flex items-stretch gap-2">
          <div className="relative h-10 min-w-90">
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
            <Select defaultValue={category} onValueChange={(val) => setCategory(val as "AGRICULTURAL" | "NON-NON_AGRICULTURAL" | " ")}>
              <SelectTrigger className="w-full h-full! min-w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value=" ">All Category</SelectItem>
                  <SelectItem value="AGRICULTURAL">Agricultural</SelectItem>
                  <SelectItem value="NON_AGRICULTURAL">Non-Agricultural</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Button><Plus /> Add New Reward</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RewardItemsHeader