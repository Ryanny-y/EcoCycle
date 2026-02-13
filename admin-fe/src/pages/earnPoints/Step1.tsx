import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FAKERECORDS } from "@/constants";
import useFetchData from "@/hooks/useFetchData";
import { formatName } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/api";
import type { RecordInterface } from "@/types/dto";
import { ChevronRight, Search } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

const Step1 = ({
  selectedRecord,
  setSelectedRecord,
  setStep,
}: {
  selectedRecord: RecordInterface | null;
  setSelectedRecord: Dispatch<SetStateAction<RecordInterface | null>>;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, loading, error } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?lastName=${searchQuery}`);

  const fakeFoundRecords: RecordInterface[] = FAKERECORDS.content.filter(
    (record) => {
      const fullName = `${record.lastName}, ${record.firstName} ${record.middleName ? `${record.middleName}.` : ""}`;
      return fullName
        .toLocaleLowerCase()
        .includes(searchQuery.toLocaleLowerCase());
    },
  );

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

      <CardContent>
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

          {searchQuery && fakeFoundRecords.length > 0 && (
            <div className="absolute top-12 left-0 w-full mt max-h-100 -2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-x-auto custom-scroll divide-y divide-gray-50">
              {fakeFoundRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => {
                    setSelectedRecord(record);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs sm:text-sm">
                    {record.firstName[0]}
                    {record.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {formatName(record.lastName, record.firstName, record.middleName)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {record.points} pts
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRecord && (
          <div className="w-full flex items-center gap-5 bg-emerald-50 border border-primary p-5 rounded-xl">
            <span className="h-14 w-14 grid place-items-center bg-primary text-white text-2xl rounded-full">
              {selectedRecord.lastName[0].toUpperCase()}
            </span>

            <div>
              <h1 className="font-bold text-lg">
                {formatName(selectedRecord.lastName, selectedRecord.firstName, selectedRecord.middleName)}
              </h1>
              <p className="text-sm">Normal Resident</p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="bg-primary text-white rounded-lg font-semibold gap-2 ml-auto px-7 py-2.5 flex items-center hover:opacity-90 duration-200"
            >
              Next <ChevronRight />
            </button>
          </div>
        )}
      </CardContent>
    </>
  );
};


export default Step1;