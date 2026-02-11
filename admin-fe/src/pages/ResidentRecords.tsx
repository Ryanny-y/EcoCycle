import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useState } from "react";
import type { RecordInterface } from "@/types/Records";
import { useSearchParams } from "react-router";
import useFetchData from "@/hooks/useFetchData";
import type { PaginatedResponse } from "@/types/api";
import RecordTable from "./residentRecords/RecordTable";
import RecordHeader from "./residentRecords/RecordHeader";
import AddRecordModal from "./residentRecords/AddRecordModal";

const ResidentRecords = () => {
  // const [records, setRecords] = useState<RecordInterface[] | null>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "0";

  const { data, loading, error, refetchData } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?page=${page}&lastName=${searchQuery}&isResident=${true}`);

  // Modals
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  return (
    <div id="records" className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Residents</h1>
        <p className="text-muted-foreground">
          Manage and view residents entries.
        </p>
      </header>

      <Card>
        {/* Filters */}
        <CardHeader className="flex items-center justify-between">
          <RecordHeader
            records={data?.content}
            setSearchQuery={setSearchQuery}
            setIsAddRecordOpen={setIsAddRecordOpen}
          />
        </CardHeader>

        {/* Tables */}
        <CardContent>
          <RecordTable
            records={data?.content}
            loading={loading}
            error={error}
          />
        </CardContent>

        {/* Pagination */}
      </Card>

      {/* Modals */}
      {isAddRecordOpen && (
        <AddRecordModal
          isAddRecordOpen={isAddRecordOpen}
          setIsAddRecordOpen={setIsAddRecordOpen}
          refetchData={refetchData}
        />
      )}
    </div>
  );
};

export default ResidentRecords;
