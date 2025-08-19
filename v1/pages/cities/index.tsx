import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import { useNearbyCities } from "@/hooks/useProperties";
import { cityImageLoader } from "@/services/utils";
import { Box, SimpleGrid, Skeleton, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NearbyCitiesProperties() {
  const { cities, loading } = useNearbyCities();
  const router = useRouter();
  return (
    <AllPropertyLayout>
      <main className="w-full py-20 px-3">
        <SimpleGrid
          cols={4}
          spacing="md"
          breakpoints={[
            { maxWidth: "72rem", cols: 3, spacing: "md" },
            { maxWidth: "62rem", cols: 2, spacing: "md" },
            { maxWidth: "48rem", cols: 2, spacing: "sm" },
            { maxWidth: "36rem", cols: 1, spacing: "sm" },
          ]}
          className="w-full "
        >
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item: number) => (
                <Skeleton key={item} height={300} className="w-full " />
              ))}
            </>
          ) : (
            <>
              {cities.map((item: CityProps, index: number) => (
                <Box
                  onClick={() => router.push(`/cities/${item.City}`)}
                  key={index}
                  className="w-full rounded-md relative h-[300px] min-w-[300px]  overflow-hidden cursor-pointer"
                >
                  <Image
                    src={item?.image}
                    alt="city random pix"
                    loader={cityImageLoader}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    loading="lazy"
                  />
                  <Box className="absolute bottom-4 left-4 bg-black/40 p-2 rounded-lg">
                    <Text className="capitalize text-xl font-manrope-semibold text-white ">
                      {item?.City}
                    </Text>
                    <Text className="capitalize text-sm font-manrope-light text-white ">
                      {item?.Count !== 1
                        ? `${Number(item?.Count).toLocaleString()} properties`
                        : `${Number(item?.Count).toLocaleString()} property`}
                    </Text>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </SimpleGrid>
        {/* <NextPrevButtons /> */}
      </main>
    </AllPropertyLayout>
  );
}
