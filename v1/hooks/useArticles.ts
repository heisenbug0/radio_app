import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useArticles({ src }: { src: string }) {
  const { data, isLoading } = useSWR(src, getterFetcher);

  return {
    articles: data?.data ?? [],
    loading: isLoading,
    error: data?.error,
  };
}
