import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useFavourites() {
  const { data, isLoading } = useSWR("get_favourite_property", getterFetcher);

  return {
    favourites: data?.data,
    loading: isLoading,
    error: data?.error,
  };
}
