import type { Role } from "@/contexts/types/AuthContextTypes";

// Dashboard Types
export interface RewardStatisticsResponse {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalActivePoints: number;

  last6MonthsTrend: Last6MonthTrend[];
  materialsCollection: MaterialsCollection[];
  topContributors: TopContributor[];
}

export interface Last6MonthTrend {
  month: string;
  earnedPoints: number;
  redeemedPoints: number;
}

export interface MaterialsCollection {
  materialName: string;
  totalWeight: number;
}

export interface TopContributor {
  fullName: string;
  earnedPoints: number;
  redeemedPoints: number;
  transactionCount: number;
}



export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: Date
}
