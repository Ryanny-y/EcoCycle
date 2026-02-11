import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useState } from "react";
import type { RecordInterface } from "@/types/Records";
import { useSearchParams } from "react-router";
import useFetchData from "@/hooks/useFetchData";
import type { PaginatedResponse } from "@/types/api";
import RecordTable from "./records/RecordTable";
import RecordHeader from "./records/RecordHeader";
import AddRecordModal from "./records/AddRecordModal";
import EditRecordModal from "./records/EditRecordModal";
import DeleteRecordModal from "./records/DeleteRecordModal";

export const fakeRecords: RecordInterface[] = [
  {
    id: "1a2b3c4d-0002",
    firstName: "Maria",
    middleName: "Isabel",
    lastName: "Santos",
    birthDate: "1985-11-22",
    gender: "FEMALE",
    isResident: true,
    address: "456 Elm Street, Riverside",
    points: 250,
    contactNumber: "+1-555-987-6543",
    createdAt: "2025-01-12T10:15:00Z",
  },
  {
    id: "1a2b3c4d-0001",
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    suffix: "Jr.",
    birthDate: "1990-05-14",
    gender: "MALE",
    isResident: true,
    address: "123 Main Street, Springfield",
    points: 120,
    contactNumber: "+1-555-123-4567",
    createdAt: "2025-01-10T08:30:00Z",
  },
  {
    id: "1a2b3c4d-0003",
    firstName: "Alex",
    middleName: "Jordan",
    lastName: "Taylor",
    birthDate: "1995-03-08",
    gender: "LGBTQIA_PLUS",
    isResident: true,
    points: 75,
    contactNumber: "+1-555-222-3344",
    createdAt: "2025-01-15T14:45:00Z",
  },
  {
    id: "1a2b3c4d-0004",
    firstName: "Priya",
    middleName: "K.",
    lastName: "Patel",
    birthDate: "1992-07-19",
    gender: "FEMALE",
    isResident: true,
    address: "789 Oak Avenue, Greenfield",
    points: 310,
    contactNumber: "+1-555-444-7788",
    createdAt: "2025-01-18T09:20:00Z",
  },
  {
    id: "1a2b3c4d-0005",
    firstName: "Sam",
    middleName: "Lee",
    lastName: "Chen",
    birthDate: "1988-12-02",
    gender: "PREFER_NOT_TO_SAY",
    isResident: true,
    points: 180,
    contactNumber: "+1-555-666-9900",
    createdAt: "2025-01-20T16:05:00Z",
  },
];

const ResidentRecords = () => {
  // const [records, setRecords] = useState<RecordInterface[] | null>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "0";

  const { data, loading, error, refetchData } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?page=${page}&lastName=${searchQuery}&isResident=${true}`);

  const fRecords = fakeRecords.sort((a, b) => a.lastName.localeCompare(b.lastName));
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
    <div id="records" className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Resident Records</h1>
        <p className="text-muted-foreground">
          Manage and view residents entries.
        </p>
      </header>

      <Card>
        {/* Filters */}
        <CardHeader className="flex flex-col items-start justify-between xl:flex-row xl:justify-between">
          <RecordHeader
            records={fRecords}
            setSearchQuery={setSearchQuery}
            setIsAddRecordOpen={setIsAddRecordOpen}
          />
        </CardHeader>

        {/* Tables */}
        <CardContent>
          <RecordTable
            records={fRecords}
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
