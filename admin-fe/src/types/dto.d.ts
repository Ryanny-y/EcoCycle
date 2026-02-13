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
  pointsPerKg: number;
  unit: string;
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
  unit?: RewardItemUnit;
  farmOrigin?: string;
  lastRestocked?: Date;
  imageUrl?: string;
  createdAt: Date;
}
