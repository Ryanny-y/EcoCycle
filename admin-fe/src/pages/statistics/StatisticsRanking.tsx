import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StatisticsRanking = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-black text-lg">Top Active Residents</CardTitle>
        <CardDescription className="text-primary font-semibold uppercase bg-emerald-100 py-1.5 px-3 rounded-full text-xs">TOP 10 Contributors</CardDescription>
      </CardHeader>

      <div className="custom-scroll rounded-xl max-h-150">
        <Table>   
          <TableHeader className="bg-stone-100 text-muted-foreground">
            <TableRow className="hover:bg-primary/10">
              <TableHead className="uppercase py-6 text-start pl-10!">
                Rank
              </TableHead>
              <TableHead className="uppercase py-6">Resident Name</TableHead>
              <TableHead className="uppercase py-6">Points Earned</TableHead>
              <TableHead className="uppercase py-6">Points Spent</TableHead>
              <TableHead className="uppercase py-6">Transactions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow className="hover:bg-primary/10 font-bold">
              <TableCell className="uppercase py-6 text-start pl-10!">
                <span className="h-10 w-10 p-2 px-4 bg-yellow-100 text-yellow-700 rounded-full font-black">
                  1
                </span>
              </TableCell>
              <TableCell className="uppercase py-6">Dela Cruz, Juan</TableCell>
              <TableCell className="uppercase py-6 text-primary">137 Points</TableCell>
              <TableCell className="uppercase py-6 text-yellow-600">37 Points</TableCell>
              <TableCell className="uppercase py-6 text-muted-foreground">13</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default StatisticsRanking;
