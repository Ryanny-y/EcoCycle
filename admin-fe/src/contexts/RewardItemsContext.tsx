import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RewardItemsContextType } from "./types/RewardItemsTypes";
import type {
  RewardItem,
  RewardItemMainCategory,
  RewardItemType,
} from "@/types/dto";
import useFetchData from "@/hooks/useFetchData";
import type { ApiResponse } from "@/types/api";
import useAuth from "./AuthContext";
import { useLocation } from "react-router";

const RewardItemsContext = createContext<RewardItemsContextType | null>(null);

export const RewardItemsProvider = ({ children }: { children: ReactNode }) => {
  const { authResponse } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState<string>("");
  const [itemType, setItemType] = useState<RewardItemType | null>(null);
  const [mainCategory, setMainCategory] =
    useState<RewardItemMainCategory | null>(null);

  // Build URL
  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search);
    if (mainCategory?.trim()) params.append("mainCategory", mainCategory);
    if (itemType?.trim()) params.append("itemType", itemType);

    if (!authResponse) return null;

    const query = params.toString();
    return query ? `exchange-items?${query}` : "exchange-items";
  }, [search, mainCategory, itemType, authResponse]);

  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<RewardItem[]>>(url);

  // RESET FILTERS WHEN PAGE CHANGES
  const resetFilters = () => {
    setSearch("");
    setMainCategory(null);
    setItemType(null);
  };

  useEffect(() => {
    resetFilters();
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      mainCategory,
      setMainCategory,
      setSearch,
      setItemType,
      refetchData,
      resetFilters,
    }),
    [data, loading, error, mainCategory, refetchData],
  );

  return (
    <RewardItemsContext.Provider value={value}>
      {children}
    </RewardItemsContext.Provider>
  );
};

const useRewardItems = () => {
  const context = useContext(RewardItemsContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useRewardItems;
