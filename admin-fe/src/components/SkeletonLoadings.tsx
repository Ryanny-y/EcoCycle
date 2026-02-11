import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export const TableSkeleton = () => (
  <div className="custom-scroll rounded-xl">
    <Table>
      <TableHeader className="bg-primary">
        <TableRow className="hover:bg-primary">
          <TableHead>
            <Skeleton className="h-4 w-25 bg-white/30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-17.5 bg-white/30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-10 bg-white/30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-15 bg-white/30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-30 bg-white/30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-22.5 bg-white/30" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-15 bg-white/30 ml-auto" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-37.5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-15" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-45" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-25" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
