import { cityImageLoader } from "@/services/utils";
import { Box, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NearbySmallCard({ city }: { city: CityProps }) {
  const router = useRouter();
  return (
    <>
      {city?.image && (
        <Box
          h={{ base: 240, lg: 500 }}
          onClick={() => router.push(`/cities/${city.City}`)}
          className="w-full rounded-xl relative overflow-hidden cursor-pointer "
        >
          <Image
            src={city?.image}
            alt="city random pix"
            loader={cityImageLoader}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[#383235] p-3 rounded-b-lg">
            <Text className="capitalize text-xl font-manrope-semibold text-white ">
              {city?.City}
            </Text>
            <Text className="capitalize text-base font-manrope-light text-white ">
              {city?.Count !== 1
                ? `${Number(city?.Count).toLocaleString()} properties`
                : `${Number(city?.Count).toLocaleString()} property`}
            </Text>
          </div>
        </Box>
      )}
    </>
  );
}
