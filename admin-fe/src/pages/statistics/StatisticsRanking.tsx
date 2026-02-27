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
import type { TopContributor } from "@/types/dto";

type StatisticsRankingProps = {
  topContributors: TopContributor[];
};

const StatisticsRanking = ({ topContributors }: StatisticsRankingProps) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-black text-lg">
          Top Active Residents
        </CardTitle>
        <CardDescription className="text-primary font-semibold uppercase bg-emerald-100 py-1.5 px-3 rounded-full text-xs">
          TOP 10 Contributors
        </CardDescription>
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
            {topContributors.map((contributor, i) => (
              <TableRow
                key={contributor.fullName}
                className="hover:bg-primary/10 font-bold"
              >
                <TableCell className="uppercase py-6 text-start pl-10!">
                  {i < 3 && <span className="h-10 w-10 p-2 px-4 bg-yellow-100 text-yellow-700 rounded-full font-black">
                    {i + 1}
                  </span>}
                </TableCell>
                <TableCell className="uppercase py-6">
                  {contributor.fullName}
                </TableCell>
                <TableCell className="uppercase py-6 text-primary">
                  {contributor.earnedPoints}{" "}
                  {contributor.earnedPoints > 1 ? "Points" : "Point"}
                </TableCell>
                <TableCell className="uppercase py-6 text-yellow-600">
                  {contributor.redeemedPoints}{" "}
                  {contributor.redeemedPoints > 1 ? "Points" : "Point"}
                </TableCell>
                <TableCell className="uppercase py-6 text-muted-foreground">
                  {contributor.transactionCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default StatisticsRanking;
