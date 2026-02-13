import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useState } from "react";
import type { RecordInterface } from "@/types/dto";
import { useSearchParams } from "react-router";
import useFetchData from "@/hooks/useFetchData";
import type { PaginatedResponse } from "@/types/api";
import RecordTable from "./records/RecordTable";
import RecordHeader from "./records/RecordHeader";
import AddRecordModal from "./records/AddRecordModal";
import EditRecordModal from "./records/EditRecordModal";
import DeleteRecordModal from "./records/DeleteRecordModal";
import PageHeader from "@/components/shared/PageHeader";
import { FAKERECORDS } from "@/constants";


const ResidentRecords = () => {
  // const [records, setRecords] = useState<RecordInterface[] | null>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "0";

  const { data, loading, error, refetchData } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?page=${page}&lastName=${searchQuery}&isResident=${true}`);

  const fakeRecords = FAKERECORDS.content.sort((a, b) => a.lastName.localeCompare(b.lastName));
  const records = data?.content
    ? [...data.content].sort((a, b) => a.lastName.localeCompare(b.lastName))
    : [];

  // Modals
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isEditRecordOpen, setIsEditRecordOpen] = useState(false);
  const [isDeleteRecordOpen, setIsDeleteRecordOpen] = useState(false);

  const [recordToEdit, setRecordToEdit] = useState<RecordInterface | null>(
    null,
  );
  const [recordToDelete, setRecordToDelete] = useState<RecordInterface | null>(
    null,
  );

  // onOpenEdit
  const openEditRecord = (record: RecordInterface) => {
    setIsEditRecordOpen(true);
    setRecordToEdit(record);
  };

  const openDeleteRecord = (record: RecordInterface) => {
    setIsDeleteRecordOpen(true);
    setRecordToDelete(record);
  };

  return (
    <div id="resident_records" className="space-y-8">
      <PageHeader
        title="Resident Records"
        description="Manage and view residents entries."
      />
      
      {/* Table Wrapper */}
      <Card>
        {/* Filters */}
        <CardHeader className="flex flex-col items-start justify-between xl:flex-row xl:justify-between">
          <RecordHeader
            records={fakeRecords}
            setSearchQuery={setSearchQuery}
            setIsAddRecordOpen={setIsAddRecordOpen}
          />
        </CardHeader>

        {/* Tables */}
        <CardContent>
          <RecordTable
            records={fakeRecords}
            loading={loading}
            error={error}
            openEditRecord={openEditRecord}
            openDeleteRecord={openDeleteRecord}
          />
        </CardContent>

        {/* Pagination */}
      </Card>

      {/* Modals */}
      {isAddRecordOpen && (
        <AddRecordModal
          isResident={true}
          isAddRecordOpen={isAddRecordOpen}
          setIsAddRecordOpen={setIsAddRecordOpen}
          refetchData={refetchData}
        />
      )}

      {isEditRecordOpen && (
        <EditRecordModal
          recordToEdit={recordToEdit}
          setRecordToEdit={setRecordToEdit}
          isEditRecordOpen={isEditRecordOpen}
          setIsEditRecordOpen={setIsEditRecordOpen}
          refetchData={refetchData}
        />
      )}

      {isDeleteRecordOpen && (
        <DeleteRecordModal
          recordToDelete={recordToDelete}
          setRecordToDelete={setRecordToDelete}
          isDeleteRecordOpen={isDeleteRecordOpen}
          setIsDeleteRecordOpen={setIsDeleteRecordOpen}
          refetchData={refetchData}
        />
      )}
    </div>
  );
};

export default ResidentRecords;
