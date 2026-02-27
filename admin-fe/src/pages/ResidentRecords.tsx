import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import useDebounce from "@/hooks/useDebounce";

const ResidentRecords = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "0";

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, loading, error, refetchData } = useFetchData<
    PaginatedResponse<RecordInterface>
  >(`records?page=${page}&search=${debouncedSearch}&isResident=${true}`);

  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.page ?? 0;

  const changePage = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage.toString());
      return params;
    });
  };

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
            isResident={true}
            records={records}
            setSearchQuery={setSearchQuery}
            setIsAddRecordOpen={setIsAddRecordOpen}
          />
        </CardHeader>

        {/* Tables */}
        <CardContent>
          <RecordTable
            records={records}
            loading={loading}
            error={error}
            openEditRecord={openEditRecord}
            openDeleteRecord={openDeleteRecord}
            refetchData={refetchData}
          />
        </CardContent>

        <CardFooter>
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 0) {
                      changePage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 0 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === index}
                    onClick={(e) => {
                      e.preventDefault();
                      changePage(index);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages - 1) {
                      changePage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
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
