import { titleImageLoader } from "@/services/utils";
import { Box, Flex, Text } from "@mantine/core";
import Image from "next/image";
import FavouriteBTN from "../global/FavouriteBTN";

export default function HomeCardImage({ data }: { data: PropertyProps }) {
  return (
    <Box className="w-full h-[234px] relative ">
      <Image
        src={data?.title_image}
        alt="property image"
        fill
        sizes="(min-width: 808px) 50vw, 100vw"
        priority
        loader={titleImageLoader}
      />

      {/* <Overlay
        gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 100%)"
        opacity={1}
        zIndex={2}
      > */}
      <Flex gap={10} align="center" pos="absolute" left={16} top={16}>
        {data?.promoted && (
          <Text className="bg-primary-700 py-0.5 px-4 text-white font-manrope-medium text-sm rounded-md ">
            Featured
          </Text>
        )}

        <Text className="bg-white py-0.5 px-4 text-primary-700 font-manrope-semibold text-sm capitalize rounded-md">
          {data?.propery_type}
        </Text>
      </Flex>

      <FavouriteBTN data={data} />
      {/* </Overlay> */}
    </Box>
  );
}
