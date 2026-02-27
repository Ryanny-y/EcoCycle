import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/SkeletonLoadings";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecordInterface } from "@/types/dto";
import dayjs from "dayjs";
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react";

interface RecordTableProps {
  records: RecordInterface[] | undefined;
  loading: boolean;
  error: string | null;
  openEditRecord: (record: RecordInterface) => void;
  openDeleteRecord: (record: RecordInterface) => void;
  refetchData: () => Promise<void>;
}

const RecordTable = ({
  records,
  loading,
  error,
  openEditRecord,
  openDeleteRecord,
  refetchData,
}: RecordTableProps) => {
  if (loading) return <TableSkeleton />;

  if (error) return <ErrorState onRetry={refetchData} />;

  if (!records) return;

  return (
    <>
      <div className="custom-scroll rounded-xl max-h-150">
        <Table id="users_table">
          <TableHeader className="bg-primary rounded-xl">
            <TableRow className="hover:bg-primary">
              <TableHead className="flex items-center text-white gap-2 py-6">
                Name
              </TableHead>
              <TableHead className="text-white">Gender</TableHead>
              <TableHead className="text-white">Age</TableHead>
              <TableHead className="text-white">Points</TableHead>
              <TableHead className="text-white">Address</TableHead>
              <TableHead className="text-white">Created At</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground py-12"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="p-5 rounded-full bg-stone-100"><Search size={30}/></span>
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-xs">
                      Try adjusting your filters or add a new record.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => {
                const fullName = `${record.lastName}, ${record.firstName} ${
                  record.middleName ? record.middleName[0] + "." : ""
                }`;
                const age = dayjs().diff(dayjs(record.birthDate), "year");

                return (
                  <TableRow
                    key={record.id}
                    className="cursor-pointer hover:bg-emerald-50/50"
                  >
                    <TableCell className="font-semibold">{fullName}</TableCell>
                    <TableCell>{record.gender}</TableCell>
                    <TableCell>{age ? age : "No Age Provided"}</TableCell>
                    <TableCell>{record.points}</TableCell>
                    <TableCell className="truncate max-w-32">
                      {record.address ? record.address : "No Address Provided"}
                    </TableCell>
                    <TableCell>
                      {dayjs(record.createdAt).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {/* <DropdownMenuItem
                          className="rounded-full"
                        >
                          <Eye className="mr-0.5 h-4 w-4" />
                          View Details
                        </DropdownMenuItem> */}
                          <DropdownMenuItem
                            className="rounded-full "
                            onClick={() => openEditRecord(record)}
                          >
                            <Edit className="mr-0.5 h-4 w-4" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive rounded-full group hover:text-destructive!"
                            onClick={() => openDeleteRecord(record)}
                          >
                            <Trash2 className="mr-0.5 h-4 w-4 group-hover:text-destructive" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RecordTable;
