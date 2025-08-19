import { getterFetcher } from "@/services/requests";
import useSWR from "swr";
import useUser from "./useUser";

export default function useAdverts() {
  const { user } = useUser();
  const { data, isLoading } = useSWR(
    `get_advertisement?customer_id=${user?.id}`,
    getterFetcher
  );
  return {
    adverts: data?.data ?? [],
    loading: isLoading,
    error: data?.error,
  };
}

export function usePackageDetails({ src }: { src: string }): {
  allPackages: PackageDetailsProps[];
  packageDetails: PackageDetailsProps;
  allLoading: boolean;
} {
  const { data, isLoading } = useSWR(src, getterFetcher);
  return {
    allPackages: data?.data,
    packageDetails: data?.data[0],
    allLoading: isLoading,
  };
}
