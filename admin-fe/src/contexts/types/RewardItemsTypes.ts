import type { ApiResponse } from '@/types/api';
import type { IRewardItem, IRewardItemMainCategory, IRewardItemType } from '@/types/rewardItem.types';

export interface RewardItemsContextType {
  data: ApiResponse<IRewardItem[]> | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  mainCategory: IRewardItemMainCategory | null;
  setMainCategory: (category: IRewardItemMainCategory) => void;
  setSearch: (search: string) => void;
  setItemType: (itemType: IRewardItemType) => void;
  resetFilters: () => void;
}