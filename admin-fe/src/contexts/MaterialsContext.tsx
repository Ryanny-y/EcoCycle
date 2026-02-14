import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Material } from "@/types/dto";
import useFetchData from "@/hooks/useFetchData";
import type { ApiResponse } from "@/types/api";
import useAuth from "./AuthContext";
import { useLocation } from "react-router";
import type {
  MaterialContextType,
  SortField,
  SortOrder,
} from "./types/MaterialsTypes";

const MaterialsContext = createContext<MaterialContextType | null>(null);

export const MaterialsProvider = ({ children }: { children: ReactNode }) => {
  const { authResponse } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  // Build URL
  const url = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search);
    if (sortField) params.append("sortBy", sortField);
    if (sortOrder) params.append("order", sortOrder);

    if (!authResponse) return null;

    const query = params.toString();
    return query ? `materials?${query}` : "materials";
  }, [search, sortField, sortOrder, authResponse]);

  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<Material[]>>(url);

  // RESET FILTERS WHEN PAGE CHANGES
  const resetFilters = () => {
    setSearch("");
  };

  useEffect(() => {
    resetFilters();
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      sortField,
      setSortField,
      sortOrder,
      setSortOrder,
      setSearch,
      refetchData,
      resetFilters,
    }),
    [data, loading, error, sortField, sortOrder, refetchData],
  );

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
};

const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useMaterials;
