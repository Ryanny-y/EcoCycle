import { TableSkeleton } from "@/components/SkeletonLoadings";
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
import type { RecordInterface } from "@/types/Records";
import dayjs from "dayjs";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

interface RecordTableProps {
  records: RecordInterface[] | undefined;
  loading: boolean;
  error: string | null;
  openEditRecord: (record: RecordInterface) => void;
  openDeleteRecord: (record: RecordInterface) => void;
}

const RecordTable = ({
  records,
  loading,
  error,
  openEditRecord,
  openDeleteRecord,
}: RecordTableProps) => {
  if (loading) return <TableSkeleton />;

  if (!records?.length) {
    return <p>No Records To Display</p>;
  }

  return (
    <>
      <div className="custom-scroll rounded-xl">
        <Table id="users_table" className="">
          <TableHeader className="bg-primary rounded-xl">
            <TableRow className="hover:bg-primary">
              <TableHead className="flex items-center text-white gap-2 py-6">Name</TableHead>
              <TableHead className="text-white">Gender</TableHead>
              <TableHead className="text-white">Age</TableHead>
              <TableHead className="text-white">Points</TableHead>
              <TableHead className="text-white">Address</TableHead>
              <TableHead className="text-white">Created At</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => {
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
                  <TableCell>{age}</TableCell>
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
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RecordTable;
