import { getterFetcher } from "@/services/requests";
import useSWR from "swr";

export default function useNotifications(): {
  allNotifications: NotificationProps[];
  loading: boolean;
} {
  const { data, isLoading } = useSWR("get_notification_list", getterFetcher);

  return {
    allNotifications: data?.data ?? [],
    loading: isLoading,
  };
}

export function useGetPaymentDetails(): {
  transactions: TransactionProps[];
  loading: boolean;
} {
  const { data, isLoading } = useSWR("get_payment_details", getterFetcher);
  return {
    transactions: data?.data ?? [],
    loading: isLoading,
  };
}
