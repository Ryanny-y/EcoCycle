import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { RecordInterface } from "@/types/Records";
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
      <div className="flex items-center gap-2 flex-1">
        <CardTitle className="text-lg">Barangay Residents</CardTitle>
        <Badge variant="secondary">
          {records?.length ? records.length : 0} Total
        </Badge>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2"
            size={16}
          />
          <Input
            value={searchInput}
            onChange={handleChange}
            className="w-full pl-7 sm:min-w-60"
            placeholder="Search by name..."
          />
        </div>
        <Button>
          <Download size={14} color="white" /> Export CSV
        </Button>
        <Button onClick={() => setIsAddRecordOpen(true)}>
          <Plus size={14} color="white" /> Add New Resident
        </Button>
      </div>
    </>
  );
};

export default RecordHeader;
