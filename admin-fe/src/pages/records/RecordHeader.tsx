import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { RecordInterface } from "@/types/dto";
import { Download, Plus, Search } from "lucide-react";
import { debounce } from "lodash";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

interface RecordHeader {
  records: RecordInterface[] | undefined;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setIsAddRecordOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RecordHeader = ({ records, setSearchQuery, setIsAddRecordOpen }: RecordHeader) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedUpdate = useMemo(() => {
    return debounce((value: string) => {
      setSearchQuery(value);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdate(value);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <CardTitle className="text-lg">Non-Residents</CardTitle>
          <Badge variant="secondary">
            {records?.length ? records.length : 0} Total
          </Badge>
        </div>

        <Button size="sm" className="flex md:hidden" onClick={() => setIsAddRecordOpen(true)}>
          <Plus size={14} color="white" /> Add
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto items-end">
        <div className="relative w-full xl:min-w-60">
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2"
            size={16}
          />
          <Input
            value={searchInput}
            onChange={handleChange}
            className="w-full pl-7"
            placeholder="Search by name..."
          />
        </div>
        <Button className="w-full sm:w-auto">
          <Download size={14} color="white" /> Export CSV
        </Button>
        <Button className="hidden md:flex" onClick={() => setIsAddRecordOpen(true)}>
          <Plus size={14} color="white" /> Add Resident
        </Button>
      </div>
    </>
  );
};

export default RecordHeader;
