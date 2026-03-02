import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import type { PaginatedResponse } from "@/types/api";
import type { IRecord } from "@/types/records.types";
import { formatName } from "@/utils/formatter";
import { ChevronRight, Search, UserCheck } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

const Step1 = ({
  selectedRecord,
  setSelectedRecord,
  setStep,
}: {
  selectedRecord: IRecord | null;
  setSelectedRecord: Dispatch<SetStateAction<IRecord | null>>;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data, loading, error } = useFetchData<
    PaginatedResponse<IRecord>
  >(`records?search=${debouncedQuery}`);

  const isDebouncing = searchQuery !== debouncedQuery;

  const foundRecords = data?.content
    ? [...data.content].sort((a, b) => a.lastName.localeCompare(b.lastName))
    : [];

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-bold">
          Who is contributing today?
        </CardTitle>
        <CardDescription>Search and Select record to proceed.</CardDescription>
      </CardHeader>

      <CardContent className={`${selectedRecord ? "max-h-none" : "max-h-10"}`}>
        <div className="relative mb-6">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="pl-10 pr-4 py-3 sm:py-5 text-base sm:text-lg font-semibold focus:ring-emerald-700!"
          />

          {searchQuery && (
            <div className="absolute top-12 left-0 w-full max-h-100 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-x-auto custom-scroll divide-y divide-gray-50">
              {loading || isDebouncing ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-red-500">
                    Failed to load records
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check your connection and try again.
                  </p>
                </div>
              ) : foundRecords.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No residents found
                  </p>
                </div>
              ) : (
                foundRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      setSelectedRecord(record);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {record.firstName[0]}
                      {record.lastName[0]}
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {formatName(
                          record.lastName,
                          record.firstName,
                          record.middleName,
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.points} pts
                      </p>
                    </div>

                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedRecord && (
          <div className="w-full flex flex-col items-start md:flex-row md:items-center gap-5 bg-emerald-50 border border-primary p-5 rounded-xl">
  
  {/* Left Section (Avatar + Name) */}
  <div className="flex items-center gap-5">
    <span className="h-14 w-14 grid place-items-center bg-primary text-white text-2xl rounded-full">
      {selectedRecord.lastName[0].toUpperCase()}
    </span>

    <div>
      <h1 className="font-bold text-lg">
        {formatName(
          selectedRecord.lastName,
          selectedRecord.firstName,
          selectedRecord.middleName,
        )}
      </h1>
      <p className="text-sm">Normal Resident</p>
    </div>
  </div>

  {/* Button */}
  <button
    onClick={() => setStep(2)}
    className="bg-primary text-white rounded-lg font-semibold gap-2 md:ml-auto px-7 py-2.5 flex items-center hover:opacity-90 duration-200"
  >
    Next <ChevronRight />
  </button>

</div>
        )}
      </CardContent>

      {!selectedRecord && (
        <div className="h-52 border border-muted-foreground rounded-xl border-dashed mx-6 flex flex-col gap-1 items-center justify-center bg-gray-50">
          <span className="bg-stone-100 p-5 rounded-full">
            <UserCheck size={40} className="text-stone-400" />
          </span>
          <p className="flex items-center justify-content-center font-semibold text-center text-muted-foreground">
            Search and select a resident to proceed
          </p>
        </div>
      )}
    </>
  );
};

export default Step1;
