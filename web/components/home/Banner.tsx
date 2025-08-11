import { BackgroundImage, Box, Group, Text } from "@mantine/core";

const Banner = () => {
  return (
    <BackgroundImage
      h={303}
      src="/banner/home_banner.svg"
      radius={20}
      p={24}
      mb={24}
    >
      <Box className="flex flex-col justify-between bg-transparent h-full">
        <Box className="w-fit px-4 h-[42px] bg-dark-2 rounded flex items-center justify-center">
          <Text fz={16} c="light_colors.2" fw={400} ff="Nunito_sans_regular">
            Upcoming Meeting at: 12:30 PM
          </Text>
        </Box>
        <Box>
          <Group gap={1}>
            <Text
              fz={72}
              c="light_colors.2"
              fw={800}
              ff="Nunito_sans_extrabold"
            >
              12:30
            </Text>
            <Text
              c="light_colors.2"
              fz={24}
              fw={500}
              ff="Nunito_sans_medium"
              tt="uppercase"
              pt={20}
            >
              pm
            </Text>
          </Group>
          <Text
            c="light_colors.2"
            fz={24}
            fw={500}
            ff="Nunito_sans_medium"
            tt="capitalize"
            mt={-20}
          >
            Friday, 29 March 2024
          </Text>
        </Box>
      </Box>
    </BackgroundImage>
  );
};

export default Banner;
