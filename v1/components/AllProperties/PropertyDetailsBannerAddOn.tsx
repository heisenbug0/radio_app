import { Box, Badge, Group, ActionIcon, Text } from "@mantine/core";
import {
  IconMapPin,
  IconClock,
  IconCurrencyNaira,
  IconHeart,
} from "@tabler/icons-react";
import FavouriteBTN from "../global/FavouriteBTN";

export default function PropertyDetailsBannerAddOn({
  data,
}: {
  data: PropertyProps;
}) {
  return (
    <div className="absolute -top-[280px] w-full px-4 space-y-4 md:space-y-0 md:flex md:justify-between md:space-x-4">
      <div>
        <Badge
          size="lg"
          variant="transparent"
          className="bg-white capitalize font-manrope-regular font-medium text-sm text-black rounded-md"
        >
          {data?.category.category}
        </Badge>
        <Text className="text-sm md:text-base lg:text-3xl text-white capitalize font-manrope-bold my-3 w-72 md:w-full">
          {data?.title}
        </Text>
        <Box className="flex items-center p-0 space-x-1">
          <IconMapPin size={20} className="text-white" />
          <Text className="capitalize font-manrope-regular font-medium text-base text-white rounded-md p-0">
            {data?.city}
          </Text>
        </Box>
        <Group mt={12}>
          <Badge
            size="lg"
            variant="transparent"
            className="capitalize font-manrope-regular font-medium text-sm text-white bg-yellow-600 rounded-md "
          >
            {data?.propery_type}
          </Badge>

          <div className="flex items-center p-0 space-x-1">
            <IconClock size={16} className="text-white" />
            <Text className="normal-case font-manrope-regular font-medium text-sm text-white rounded-md p-0">
              {data?.post_created}
            </Text>
          </div>
        </Group>
        <div className="flex items-center px-1.5 mt-2 bg-primary-700 rounded-md w-fit">
          <IconCurrencyNaira size={30} className="text-white" />
          <Text className="text-xl font-manrope-medium text-white">
            {Number(data?.price).toLocaleString()}
          </Text>
        </div>
      </div>
      <FavouriteBTN data={data} />
    </div>
  );
}
