import FavouriteBTN from "@/components/global/FavouriteBTN";
import { parameterImageLoader, titleImageLoader } from "@/services/utils";
import { Paper, Box, Group, Divider, SimpleGrid, Text } from "@mantine/core";
import { IconBuildingWarehouse, IconCurrencyNaira } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function MostViewedCard({ data }: { data: PropertyProps }) {
  const router = useRouter();

  return (
    <Paper
      withBorder
      radius={16}
      maw={723}
      className="xl:flex cursor-pointer "
      onClick={() => router.push(`/properties/${data?.id}`)}
    >
      <Box
        h={241}
        className="relative overflow-hidden rounded-tl-[16px] rounded-tr-[16px] xl:rounded-l-[16px] xl:rounded-tr-none w-full xl:w-[241px]"
      >
        <Image
          src={data?.title_image}
          alt="property image"
          fill
          loader={titleImageLoader}
          sizes="(min-width: 808px) 50vw, 100vw"
          priority
        />
        <FavouriteBTN data={data} />
        <div className="bottom-5 left-4 absolute flex items-center w-full space-x-14">
          <Text className="bg-yellow-600 py-0.5 px-4 text-white font-manrope-regular text-base capitalize rounded-md">
            {data?.propery_type}
          </Text>
          <Group spacing={0} className="text-white bg-black px-1 ">
            <IconCurrencyNaira size={20} />
            <Text maw={70} truncate className="font-manrope-bold text-sm  ">
              {Number(data?.price).toLocaleString()}
            </Text>
          </Group>
        </div>
      </Box>
      <Box className="flex-1">
        <Box className="w-full p-4">
          <Group spacing={3} mb={6}>
            <IconBuildingWarehouse className="text-primary-700" size={24} />
            <Text className="text-base capitalize font-manrope-bold">
              {data?.title}
            </Text>
          </Group>
          <Text
            truncate
            maw={300}
            className="capitalize font-manrope-medium text-sm "
          >
            {data?.description}
          </Text>
          <Text className="capitalize font-manrope-regular text-sm">
            {`${data?.city} ${data?.country}`}
          </Text>
          <Divider my={16} />
          <Box className="w-full">
            <SimpleGrid
              cols={2}
              spacing="md"
              breakpoints={[
                { maxWidth: "62rem", cols: 2, spacing: "md" },
                { maxWidth: "48rem", cols: 2, spacing: "sm" },
                { maxWidth: "36rem", cols: 2, spacing: "sm" },
              ]}
              className="w-full "
            >
              {data?.parameters.map(
                (item: { id: number; name: string; image: string }) => (
                  <Box className="flex items-center space-x-1" key={item.id}>
                    <div className="w-[30px] h-[15px] overflow-hidden flex items-center relative ">
                      <Image
                        src={item.image}
                        loader={parameterImageLoader}
                        alt="Category Image"
                        fill
                        sizes="(min-width: 808px) 50vw, 100vw"
                        priority
                      />
                    </div>
                    <Text className="capitalize text-neutral-600 font-normal font-manrope-regular text-xs ">
                      {item.name}
                    </Text>
                  </Box>
                )
              )}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
