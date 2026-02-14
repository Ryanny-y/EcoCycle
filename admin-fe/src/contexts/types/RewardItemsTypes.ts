import type { ApiResponse } from '@/types/api';
import type { RewardItem, RewardItemMainCategory, RewardItemType } from '@/types/dto';

export interface RewardItemsContextType {
  data: ApiResponse<RewardItem[]> | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  mainCategory: RewardItemMainCategory | null;
  setMainCategory: (category: RewardItemMainCategory) => void;
  setSearch: (search: string) => void;
  setItemType: (itemType: RewardItemType) => void;
  resetFilters: () => void;
}