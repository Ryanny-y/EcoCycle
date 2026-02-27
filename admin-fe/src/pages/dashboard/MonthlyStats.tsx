import { Coins, Gift, Users } from "lucide-react";

type MonthlyStatsProps = {
  pointsEarnedThisMonth: number;
  rewardsRedeemedThisMonth: number;
  averagePointsPerResident: number;
};

const MonthlyStats = ({
  pointsEarnedThisMonth,
  rewardsRedeemedThisMonth,
  averagePointsPerResident,
}: MonthlyStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100 relative overflow-hidden group">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
            Points Earned This Month
          </span>
          <h4 className="text-3xl font-black mt-1">{pointsEarnedThisMonth}</h4>
          <p className="text-xs mt-2 text-emerald-100">
            12% more than last month
          </p>
        </div>
        <Coins
          size={120}
          className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Rewards Redeemed
          </span>
          <h4 className="text-3xl font-black text-gray-900 mt-1">
            {rewardsRedeemedThisMonth}
          </h4>
          <p className="text-xs mt-2 text-gray-500">
            Active community engagement
          </p>
        </div>
        <Gift
          size={120}
          className="absolute -right-8 -bottom-8 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Avg Points / Resident
          </span>
          <h4 className="text-3xl font-black text-gray-900 mt-1">
            {averagePointsPerResident.toFixed(2)}
          </h4>
          <p className="text-xs mt-2 text-gray-500">
            Healthy point circulation
          </p>
        </div>
        <Users
          size={120}
          className="absolute -right-8 -bottom-8 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform"
        />
      </div>
    </div>
  );
};

export default MonthlyStats;
