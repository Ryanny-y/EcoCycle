import type { Role } from "@/contexts/types/AuthContextTypes";

// Dashboard Types
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

export type Gender = 'MALE' | 'FEMALE' | 'LGBTQIA_PLUS' | 'PREFER_NOT_TO_SAY'; 

export interface RecordInterface {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  birthDate: string;
  gender: Gender;
  isResident: boolean;
  address?: string; 
  points: number;
  contactNumber: string;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  pointsPerKg: number;
  imageUrl: string;
  createdAt: Date;
}

export type RewardItemMainCategory = "AGRICULTURAL" | "NON_AGRICULTURAL";
export type RewardItemUnit = "KG" | "PIECE" | "BUNDLE" | "SACK" | "POT";
export type RewardItemType = "PRODUCT" | "FARM";

export interface RewardItem {
  id: string;
  name: string;
  description?: string;
  itemType: RewardItemType;
  mainCategory: RewardItemMainCategory
  subCategory: string;
  stocks: number;
  requiredPoints: number;
  unit: RewardItemUnit;
  farmOrigin?: string;
  lastRestocked?: Date;
  imageUrl: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt: Date
}