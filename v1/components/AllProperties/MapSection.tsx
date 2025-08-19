import { Paper, Divider, Box, Group, Text, Loader } from "@mantine/core";
import { useMemo } from "react";
import dynamic from "next/dynamic";

export default function MapSection({ data }: { data: PropertyProps }) {
  const Map = useMemo(
    () =>
      dynamic(() => import("./PropertyLocation"), {
        loading: () => (
          <div className="h-[400px] w-full flex items-center justify-center">
            <Loader size="md" color="dark" />
          </div>
        ),
        ssr: false,
      }),
    []
  );

  return (
    <Paper radius={8} withBorder className="mt-7">
      <Text className="text-black font-manrope-bold text-base capitalize p-5">
        address
      </Text>
      <Divider />
      <Box className="w-full p-5">
        <Box>
          <Group mb={10}>
            <Text
              w={100}
              className="text-black text-base capitalize font-manrope-regular"
            >
              address
            </Text>
            <Text className="text-black text-base capitalize font-manrope-regular">
              {data?.address}
            </Text>
          </Group>
          <Group mb={10}>
            <Text
              w={100}
              className="text-black text-base capitalize font-manrope-regular"
            >
              city
            </Text>
            <Text className="text-black text-base capitalize font-manrope-regular">
              {data?.city}
            </Text>
          </Group>
          <Group mb={10}>
            <Text
              w={100}
              className="text-black text-base capitalize font-manrope-regular"
            >
              state
            </Text>
            <Text className="text-black text-base capitalize font-manrope-regular">
              {data?.state}
            </Text>
          </Group>
          <Group>
            <Text
              w={100}
              className="text-black text-base capitalize font-manrope-regular"
            >
              country
            </Text>
            <Text className="text-black text-base capitalize font-manrope-regular">
              {data?.country}
            </Text>
          </Group>
        </Box>
        <Box className="w-full mt-10 h-[400px] ">
          <Map data={data} />
        </Box>
      </Box>
    </Paper>
  );
}
