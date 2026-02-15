import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type TableSkeletonProps = {
  rows?: number
  headLength?: number
}

export const TableSkeleton = ({
  rows = 5,
  headLength = 7,
}: TableSkeletonProps) => (
  <div className="custom-scroll rounded-xl">
    <Table>
      <TableHeader className="bg-primary">
        <TableRow className="hover:bg-primary">
          {Array.from({ length: headLength }).map((_, index) => (
            <TableHead key={index}>
              <Skeleton className="h-4 w-20 bg-white/30" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: headLength }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
