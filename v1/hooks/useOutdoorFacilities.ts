import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useOutdoorFacilities(): {
  outdoorFacilities: OutdoorFacilitiesProps[];
  loading: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR("get_facilities", getterFetcher);

  return {
    outdoorFacilities: data?.data ?? [],
    loading: isLoading,
    error: data?.error,
  };
}
