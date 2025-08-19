import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useGetter(url: string) {
  const { data, isLoading } = useSWR(url, getterFetcher);

  return { data: data?.data, loading: isLoading, error: data?.error };
}
