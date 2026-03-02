import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import useDebounce from "@/hooks/useDebounce";
import useAuthFetch from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import useAuth from "@/contexts/AuthContext";
import type { IRecord } from "@/types/records.types";

interface RecordHeader {
  isResident: boolean;
  records: IRecord[] | undefined;
  totalRecords: number;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setIsAddRecordOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RecordHeader = ({ isResident, setSearchQuery, setIsAddRecordOpen, totalRecords }: RecordHeader) => {
  const { authResponse } = useAuth();
  const [searchInput, setSearchInput] = useState<string>("");
  const [ isExportingUserData, setIsExportingUserData ] = useState<boolean>(false);
  const authFetch = useAuthFetch(); 

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery])

  const exportRecordsData = async (isResident: boolean) => {
    if(isExportingUserData) return;  

    setIsExportingUserData(true);
    try {
      const endpointUrl = `records/export?isResident=${isResident}`
      const response = await authFetch(endpointUrl, {
        method: "GET",
        raw: true
      });

      if (!response || !response.ok) {
        throw new Error("Failed to fetch file");
      }
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = isResident
                ? "resident_records.csv"
                : "non_resident_records.csv";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?$/);
        if (match?.[1]) {
          fileName = match[1];
        }
      }
      
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Required for Firefox
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      window.URL.revokeObjectURL(url);
      toast.success("User data exported successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to export user data. Please try again.");
    } finally {
      setIsExportingUserData(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <CardTitle className="text-lg">{isResident ? "Residents" : "Non-Residents"}</CardTitle>
          <Badge variant="secondary">
            {totalRecords} Total
          </Badge>
        </div>

        <Button size="sm" className="flex md:hidden" onClick={() => setIsAddRecordOpen(true)}>
          <Plus size={14} color="white" /> Add
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto items-end">
        <div className="relative w-full xl:min-w-96">
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-2"
            size={16}
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-7"
            placeholder="Search by name..."
          />
        </div>
        {authResponse?.data.role === "SUPER_ADMIN" && <Button className="w-full sm:w-auto" onClick={() => exportRecordsData(isResident)}>
          <Download size={14} color="white" /> Export CSV
        </Button>}
        <Button className="hidden md:flex" onClick={() => setIsAddRecordOpen(true)}>
          <Plus size={14} color="white" /> {isResident ? "Add Resident" : "Add Non-Resident"}
        </Button>
      </div>
    </>
  );
};

export default RecordHeader;
