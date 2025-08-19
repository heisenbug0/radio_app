import { Box, ActionIcon, Group, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function FeatureListingHeader({
  title,
  link,
}: {
  title: string;
  link: string;
}) {
  const router = useRouter();
  return (
    <Box className="w-full flex space-x-6 justify-between items-center">
      <Box className="flex-1">
        <Text
          tt="capitalize"
          span
          className="text-neutral-800 font-manrope-extrabold text-xl md:text-[30px] "
        >
          {title}
        </Text>
      </Box>
      <ActionIcon
        onClick={() => router.push(link)}
        variant="subtle"
        className="w-fit h-12 bg-transparent text-neutral-950 capitalize text-base rounded-full md:hover:bg-black pr-7 md:hover:text-white md:transition md:ease-in-out md:delay-80 md:duration-700"
      >
        <Group spacing={15}>
          <Box
            w={48}
            h={48}
            className="rounded-full flex items-center justify-center bg-black "
          >
            <IconArrowRight size={18} className="text-white" />
          </Box>
          <Text className="font-manrope-semibold text-base capitalize hidden md:flex">
            see all properties
          </Text>
        </Group>
      </ActionIcon>
    </Box>
  );
}
