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
import { ArrowDownUp, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

interface RecordTableProps {
  records: RecordInterface[] | undefined;
  loading: boolean;
  error: string | null;
}

const RecordTable = ({ records }: RecordTableProps) => {

  if(!records?.length) {
    return <p>No Records</p>
  }

  return (
    <>
      <div className="custom-scroll overflow-x-auto">
        <Table id="users_table">
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center gap-2">
                Name <ArrowDownUp size={16} />
              </TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => {
              const fullName = `${record.lastName}, ${record.firstName} ${
                record.middleName ? record.middleName[0] + "." : ""
              }`;
              const age = dayjs().diff(dayjs(record.birthDate), "year");

              return (
                <TableRow key={record.id} className="cursor-pointer">
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{record.gender}</TableCell>
                  <TableCell>{age}</TableCell>
                  <TableCell>{record.points}</TableCell>
                  <TableCell>{record.address}</TableCell>
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
                        <DropdownMenuItem
                          className="rounded-full"
                          // onClick={() => setDateSpotDetails(dateSpot)}
                        >
                          <Eye className="mr-0.5 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-full"
                          // onClick={() => setDateSpotToEdit(dateSpot)}
                        >
                          <Edit className="mr-0.5 h-4 w-4" />
                          Edit Record
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive rounded-full"
                          // onClick={() => handleDeleteDateSpot(dateSpot.id)}
                        >
                          <Trash2 className="mr-0.5 h-4 w-4" />
                          Delete Spot
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
