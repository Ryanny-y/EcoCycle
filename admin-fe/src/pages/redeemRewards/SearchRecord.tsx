import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, ChevronRight, Gift, Search, X } from "lucide-react";
import type { RecordInterface } from "@/types/dto";
import { useState, type Dispatch, type SetStateAction } from "react";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import type { PaginatedResponse } from "@/types/api";
import { formatName } from "@/utils/formatter";

type SearchRecordProps = {
  selectedRecord: RecordInterface | null;
  setSelectedRecord: Dispatch<SetStateAction<RecordInterface | null>>;
};

const SearchRecord = ({
  selectedRecord,
  setSelectedRecord,
}: SearchRecordProps) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearch = useDebounce(searchInput, 700);

  const { data, loading, error } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?search=${debouncedSearch}`);

  const foundRecords = data?.content
    ? [...data.content].sort((a, b) => a.lastName.localeCompare(b.lastName))
    : [];

  return (
    <>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Redeem Points for Rewards
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative h-12">
            <Search
              size={22}
              className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-3"
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="py-3 pl-12 pr-5 text-lg! h-full w-full"
              placeholder="Search record to swap points..."
            />

            {searchInput && foundRecords.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-gray-50">
                {foundRecords.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRecord(r);
                      setSearchInput("");
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      {r.firstName[0]}
                      {r.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {r.lastName}, {r.firstName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: {r.points} pts
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedRecord && (
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 p-6 bg-emerald-50 rounded-2xl border border-primary animate-in slide-in-from-left-4 relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                <Gift size={32} />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Selected Resident
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">
                  {formatName(
                    selectedRecord.lastName,
                    selectedRecord.firstName,
                    selectedRecord.middleName,
                  )}
                </h3>
                <p className="text-sm sm:text-base text-emerald-800">
                  Available Points:{" "}
                  <span className="font-bold underline">
                    {selectedRecord.points} pts
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 p-2 text-primary/70 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {!selectedRecord && (
        <div className="border border-dashed bg-white rounded-xl h-72 flex items-center justify-center flex-col">
          <ArrowLeftRight className="mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground/80 font-bold text-xl">
            Please select a resident first
          </p>
          <p className="text-stone-400">
            Available rewards will be displayed once a resident is identified.
          </p>
        </div>
      )}
    </>
  );
};

export default SearchRecord;
