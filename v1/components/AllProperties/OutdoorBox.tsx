import { facilityImageLoader } from "@/services/utils";
import { Paper, Divider, Box, SimpleGrid, Group, Text } from "@mantine/core";
import Image from "next/image";

export default function OutdoorBox({ data }: { data: PropertyProps }) {
  return (
    <Paper radius={8} withBorder className="mt-7">
      <Text className="text-black font-manrope-bold text-base capitalize p-5">
        Outdoor Facilities
      </Text>
      <Divider />
      <Box className="w-full p-5">
        <SimpleGrid
          cols={4}
          spacing="md"
          breakpoints={[
            { maxWidth: "62rem", cols: 2, spacing: "md" },
            { maxWidth: "48rem", cols: 2, spacing: "sm" },
            { maxWidth: "36rem", cols: 2, spacing: "sm" },
          ]}
          className="w-full "
        >
          {data?.assign_facilities.map((item) => (
            <Group key={item.id} spacing={12}>
              <Paper
                withBorder
                w={38}
                h={38}
                className="rounded-lg flex justify-center items-center "
              >
                <div className="w-[30px] h-[15px] overflow-hidden flex items-center relative ">
                  <Image
                    src={item.image}
                    loader={facilityImageLoader}
                    alt="facility Image"
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    priority
                  />
                </div>
              </Paper>
              <Box>
                <Text className="capitalize text-neutral-800 font-normal font-manrope-regular text-sm">
                  {item.name}
                </Text>
                <Text className="capitalize text-neutral-800 font-normal font-manrope-regular text-sm">
                  {item.distance !== 1
                    ? `${item.distance} kilometres`
                    : `${item.distance} kilometre`}
                </Text>
              </Box>
            </Group>
          ))}
        </SimpleGrid>
      </Box>
    </Paper>
  );
}
