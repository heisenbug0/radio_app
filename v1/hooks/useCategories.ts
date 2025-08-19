import { getterFetcher } from "@/services/requests";
import { SelectItem } from "@mantine/core";
import { useMemo } from "react";
import useSWR from "swr";

export default function useCategories(): {
  allCategories: AllCategoriesProps[];
  selectCategories: SelectItem[];
  loading: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR("get_categories", getterFetcher);

  const filteredCategories: SelectItem[] = useMemo(() => {
    if (data?.data) {
      return data.data.map((category: { id: number; category: string }) => ({
        value: category.id,
        label: category.category,
      }));
    }
  }, [data]);

  return {
    allCategories: data?.data ?? [],
    selectCategories: filteredCategories ?? [],
    loading: isLoading,
    error: data?.error,
  };
}

export function useCategoryById(catId: string): {
  allCategories: any;
  loading: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR(
    catId ? `get_category_details?id=${catId}` : null,
    getterFetcher
  );

  return {
    allCategories: data?.data ?? [],
    loading: isLoading,
    error: data?.error,
  };
}
