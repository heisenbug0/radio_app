import { parameterImageLoader, titleImageLoader } from "@/services/utils";
import { Paper, Box, Group, Divider, SimpleGrid, Text } from "@mantine/core";
import { IconBuildingWarehouse, IconCurrencyDollar } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import FavouriteBTN from "../global/FavouriteBTN";

export default function PropertiesLongCard({ data }: { data: PropertyProps }) {
  const router = useRouter();
  return (
    <Paper
      withBorder
      radius={13}
      className="xl:flex cursor-pointer"
      onClick={() => router.push(`/properties/${data?.slug}`)}
    >
      <Box
        h={200}
        className="relative overflow-hidden rounded-tl-[13px] rounded-tr-[13px] xl:rounded-l-[13px] xl:rounded-tr-none w-full xl:w-[296px] "
      >
        <Image
          src={data?.title_image}
          alt="property image"
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          priority
          loader={titleImageLoader}
        />
        {data?.promoted && (
          <Text className="bg-primary-700 p-2 text-white top-4 left-4 font-manrope-medium text-sm rounded-md absolute">
            Featured
          </Text>
        )}
        <FavouriteBTN data={data} />
        <Group
          spacing={0}
          className="absolute text-white bg-black px-1 bottom-3 right-4"
        >
          <IconCurrencyDollar size={20} />
          <Text maw={140} truncate className="font-manrope-bold text-sm  ">
            {Number(data?.price).toLocaleString()}
          </Text>
        </Group>
        <Text className="bg-yellow-500 py-0.5 px-7 text-white bottom-3 left-4 font-manrope-regular text-base capitalize rounded-md absolute">
          {data?.propery_type}
        </Text>
      </Box>
      <Box className="flex-1">
        <Box className="w-full p-4">
          <Group spacing={3} mb={6}>
            <IconBuildingWarehouse className="text-primary-700" size={24} />
            <Text className="text-base capitalize font-manrope-medium">
              {data?.title}
            </Text>
          </Group>
          <Text
            truncate
            className="capitalize font-manrope-medium text-sm w-[300px] xl:w-[500px] "
          >
            {data?.address}
          </Text>
          <Text className="capitalize font-manrope-bold text-sm mt-2">
            {`${data?.city} ${data?.country}`}
          </Text>
          <Divider my={16} />
          <Box className="w-full">
            <SimpleGrid
              cols={3}
              spacing="md"
              breakpoints={[
                { maxWidth: "62rem", cols: 3, spacing: "md" },
                { maxWidth: "48rem", cols: 2, spacing: "sm" },
                { maxWidth: "36rem", cols: 2, spacing: "sm" },
              ]}
              className="w-full "
            >
              {data?.parameters.map(
                (item: { id: number; name: string; image: string }) => (
                  <Group key={item.id} spacing={12}>
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
                    <Text className="capitalize text-neutral-600 font-normal font-manrope-regular text-xs">
                      {item.name}
                    </Text>
                  </Group>
                )
              )}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
