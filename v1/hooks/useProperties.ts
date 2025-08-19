import { getterFetcher } from "@/services/requests";
import { useMemo } from "react";
import useSWR from "swr";

export default function useProperties({ src }: { src: string }): {
  properties: PropertyProps[];
  loading: boolean;
  error: boolean;
  totalProps: number;
  totalViews: number;
} {
  const { data, isLoading } = useSWR(src, getterFetcher);

  const totalViews = useMemo(() => {
    let sum: number = 0;
    data?.data?.map((property: { total_view: number }) => {
      sum += property.total_view;
    });
    return sum;
  }, [data]);

  return {
    properties: data?.data ?? [],
    loading: isLoading,
    error: data?.error,
    totalProps: data?.total,
    totalViews,
  };
}

export function useNearbyCities(): {
  cities: CityProps[];
  loading: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR(
    "get_count_by_cities_categoris",
    getterFetcher
  );

  return {
    cities: data?.city_data ?? [],
    loading: isLoading,
    error: data?.error,
  };
}

export function useLocations(): {
  city: any;
  state: any;
  country: any;
  loading: boolean;
  error: boolean;
} {
  const { data, isLoading } = useSWR(
    "get_count_by_city_state_country",
    getterFetcher
  );

  const filter = useMemo(() => {
    const selectData = {
      city: [],
      state: [],
      country: [],
    };
    if (data) {
      const cData = data?.city_data?.map((city: any) => city.city);
      const sData = data?.state_data?.map((state: any) => state.state);
      const couData = data?.country_data?.map(
        (country: any) => country.country
      );

      selectData.city = cData;
      selectData.state = sData;
      selectData.country = couData;
    }
    return selectData;
  }, [data]);

  return {
    city: filter?.city ?? [],
    state: filter?.state ?? [],
    country: filter?.country ?? [],
    loading: isLoading,
    error: data?.error,
  };
}
