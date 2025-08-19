import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useRealtors(): {
  realtors: RealtorsProps[];
  fetching: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR("get_agents_details", getterFetcher);

  return {
    realtors: data?.agent_data,
    fetching: isLoading,
    error: data?.error,
  };
}
