export interface MontlyRecordGrowth {
  month: string;
  totalResidents: number;
  totalNonResidents: number;
}

export interface TopMaterialResponse {
  name: string;
  quantity: number;
}

export interface WeeklyCollectionResponse {
  week: number;
  total: number;
}

export interface MonthlyCollectionResponse {
  month: string;
  total: number;
}

export interface DashboardDataResponse {
  totalResidents: number;
  totalMaterialsCollected: number;
  totalPointsEarned: number;
  totalRewardsRedeemed: number;
  lowStockRewardsCount: number;
  monthlyRecordGrowth: MontlyRecordGrowth[]
  topCollectedMaterials: TopMaterialResponse[];
  weeklyCollections: WeeklyCollectionResponse[];
  monthlyCollections: MonthlyCollectionResponse[];
  pointsEarnedThisMonth: number;
  rewardsRedeemedThisMonth: number;
  averagePointsPerResident: number;
}
