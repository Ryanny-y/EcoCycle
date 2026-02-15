import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
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


export const Step2MaterialsSkeleton = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-bold">
          Recyclables List
        </CardTitle>
        <CardDescription>
          Loading materials...
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 rounded-2xl border border-gray-100 bg-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
};
