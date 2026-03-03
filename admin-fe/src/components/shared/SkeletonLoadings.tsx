import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import PageHeader from "./PageHeader";

type TableSkeletonProps = {
  rows?: number;
  headLength?: number;
};

export const TableSkeleton = ({
  rows = 10,
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
        <CardDescription>Loading materials...</CardDescription>
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

export const RewardCardSkeleton = () => {
  return (
    <Card className="pt-0 gap-3 animate-pulse">
      {/* Image placeholder */}
      <div className="h-40 flex items-center justify-center w-full bg-muted py-5">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content */}
      <CardContent className="space-y-3">
        <Badge>
          <Skeleton className="h-4 w-20" />
        </Badge>

        <div className="text-lg font-bold space-y-1">
          <Skeleton className="h-5 w-32" /> {/* Reward Name */}
          <Skeleton className="h-4 w-20" /> {/* Points */}
        </div>

        <div className="flex items-center justify-between text-xs">
          <p className="text-muted-foreground">
            <Skeleton className="h-3 w-12" />
          </p>
          <p className="font-bold">
            <Skeleton className="h-3 w-10" />
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full py-5" disabled>
          <Skeleton className="h-5 w-full" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export const GridCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="pt-0 gap-2 animate-pulse">
          {/* Image placeholder */}
          <div className="relative h-44 rounded-t-xl overflow-hidden bg-muted">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge>
              <Skeleton className="h-4 w-20" />
            </Badge>
          </div>

          {/* Content */}
          <CardContent className="px-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" /> {/* Name */}
              <Skeleton className="h-5 w-12" /> {/* Points */}
            </div>
            <Skeleton className="h-4 w-full" /> {/* Description */}
          </CardContent>

          {/* Footer */}
          <CardFooter className="px-4 mt-5 flex items-center justify-between flex-wrap gap-x-5">
            <Skeleton className="h-4 w-24" /> {/* Stock */}
            <Skeleton className="h-4 w-12" /> {/* Low stock alert */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export const StatisticsSkeleton = () => {
  return (
    <div id="statistics" className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="System status and recent recycling activity."
      />
      <div className="grid grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="flex flex-col items-start gap-1">
              <Skeleton className="h-12 w-12 rounded-md mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card className="h-120" key={index}>
            <CardContent className="px-6">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="w-full h-80" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="font-black text-lg">
            Top Active Residents
          </CardTitle>
          <CardDescription className="text-primary font-semibold uppercase bg-emerald-100 py-1.5 px-3 rounded-full text-xs">
            TOP 10 Contributors
          </CardDescription>
        </CardHeader>

        <div>
          <Table>
            <TableHeader className="bg-stone-200">
              <TableRow className="bg-stone-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-6 w-20 " />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 5 }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-5 bg-gray-100">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>{" "}
        </div>
      </Card>
    </div>
  );
};
