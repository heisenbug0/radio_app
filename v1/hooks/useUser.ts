import { getterFetcher } from "@/services/requests";
import useSWR from "swr";
import Cookies from "js-cookie";

export default function useUser(): {
  user: UserProps;
  loading: boolean;
  error: boolean;
} {
  const token = Cookies.get("access_token");
  const { data, isLoading } = useSWR(
    token ? `get_user_by_id` : null,
    getterFetcher
  );

  return {
    user: data?.data,
    loading: isLoading,
    error: data?.error,
  };
}
