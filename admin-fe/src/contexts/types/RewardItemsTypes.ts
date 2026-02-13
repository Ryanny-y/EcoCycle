import type { ApiResponse } from '@/types/api';
import type { RewardItem, RewardItemMainCategory } from '@/types/dto';

export interface RewardItemsContextType {
  data: ApiResponse<RewardItem[]> | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  setCategory: (category: RewardItemMainCategory) => void;
}