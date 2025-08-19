import { Box, Text } from "@mantine/core";
import { IconMail, IconPhoneCall, IconMapPin } from "@tabler/icons-react";

export default function FooterContact() {
  return (
    <Box>
      <Box className="flex space-x-2 mb-4 items-center">
        <IconMapPin size={25} className="text-white" />
        <Text className="text-sm font-manrope-regular text-white ">
          7095 Hollywood Blvd, #581, Hollywood, CA 90028
        </Text>
      </Box>
      <Box className="flex space-x-2 mb-4 items-center">
        <IconMail size={25} className="text-white" />
        <Text
          component="a"
          href="mailto:iloverealestates@gmail.com"
          className="text-sm font-manrope-regular text-white hover:text-primary-700"
        >
          iloverealestates@gmail.com
        </Text>
      </Box>
      <Box className="flex space-x-2 mb-4 items-center">
        <IconPhoneCall size={25} className="text-white" />
        <Text
          component="a"
          href="tel:+1 840 600 1116"
          className="text-sm font-manrope-regular text-white hover:text-primary-700"
        >
          +1 840 600 1116
        </Text>
      </Box>

      {/* <Box>
        <Text
          mb={10}
          fz={21}
          className="font-manrope-semibold capitalize text-white"
        >
          follow us
        </Text>
        <Group>
          <IconBrandFacebook className="text-white" size={28} />
          <IconBrandInstagram className="text-white" size={28} />
          <IconBrandTwitter className="text-white" size={28} />
        </Group>
      </Box> */}
    </Box>
  );
}
