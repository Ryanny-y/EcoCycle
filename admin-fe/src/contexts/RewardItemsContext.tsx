import { createContext, useContext, useState, type ReactNode } from "react";
import type { RewardItemsContextType } from "./types/RewardItemsTypes";
import type { RewardItem, RewardItemMainCategory } from "@/types/dto";
import useFetchData from "@/hooks/useFetchData";
import type { ApiResponse } from "@/types/api";
import useAuth from "./AuthContext";

const RewardItemsContext = createContext<RewardItemsContextType | null>(null)

export const RewardItemsProvider = ({ children } : { children: ReactNode }) => {
  const { authResponse } = useAuth();

  const [ category, setCategory ] = useState<RewardItemMainCategory>("AGRICULTURAL");
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<RewardItem[]>>(authResponse ? "exchange-items" : null);
  
  return (
    <RewardItemsContext.Provider value={{ data, loading, error, setCategory, refetchData }}>
      { children }
    </RewardItemsContext.Provider>
  )
}

const useRewardItems = () => {
  const context = useContext(RewardItemsContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useRewardItems;