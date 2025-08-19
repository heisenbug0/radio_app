import { Paper, Box, Group, Text } from "@mantine/core";
import HomeCardImage from "../HomeCardImage";
import { useRouter } from "next/router";
import { IconCurrencyNaira } from "@tabler/icons-react";

export default function HomeCard({ data }: { data: PropertyProps }) {
  const router = useRouter();

  return (
    <Paper
      withBorder
      radius={10}
      className="w-full overflow-hidden cursor-pointer "
      onClick={() => router.push(`/properties/${data?.slug}`)}
    >
      <HomeCardImage data={data} />
      <Box className="w-full p-4 ">
        <Group spacing={0} className="text-black mb-2 ">
          <IconCurrencyNaira size={20} />
          <Text maw={400} truncate className="font-manrope-bold text-sm  ">
            {Number(data?.price).toLocaleString()}
          </Text>
        </Group>
        <Group spacing={4} mb={6}>
          <Text
            lineClamp={2}
            className="text-sm capitalize font-manrope-medium"
          >
            {data?.title}
          </Text>
        </Group>

        <Text
          truncate
          maw={400}
          className="capitalize font-manrope-bold text-xs mt-2"
        >
          {`${data?.city} ${data?.country}`}
        </Text>
      </Box>
    </Paper>
  );
}
