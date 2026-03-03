export type IRewardItemMainCategory = "AGRICULTURAL" | "NON_AGRICULTURAL";
export type IRewardItemUnit = "KG" | "PIECE" | "BUNDLE" | "SACK" | "POT";
export type IRewardItemType = "PRODUCT" | "FARM";

export interface IRewardItem {
  id: string;
  name: string;
  description?: string;
  itemType: IRewardItemType;
  mainCategory: IRewardItemMainCategory
  subCategory: string;
  stocks: number;
  requiredPoints: number;
  unit: IRewardItemUnit;
  farmOrigin?: string;
  lastRestocked?: Date;
  imageUrl: string;
  createdAt: Date;
}