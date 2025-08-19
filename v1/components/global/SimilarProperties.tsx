import { Box, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import HomeCard from "../home/cards/HomeCard";
import { useLocalStyles } from "@/data/usestyles";

export default function SamilarProperties({
  properties,
}: {
  properties: PropertyProps[];
}) {
  const { classes } = useLocalStyles();

  return (
    <Box pt={25}>
      <Box mb={30}>
        <Box className="w-full flex space-x-6 justify-between items-center">
          <Box className="flex-1">
            <Text
              fz={30}
              span
              className="text-neutral-800 font-manrope-extrabold capitalize "
            >
              similar
            </Text>
            <Text
              fz={30}
              span
              className="text-neutral-100 px-3 font-manrope-extrabold ml-3 bg-primary-700 capitalize"
            >
              Properties
            </Text>
          </Box>
        </Box>
      </Box>
      <Box className="w-full" mb={30}>
        <Carousel
          classNames={classes}
          controlSize={35}
          slideSize="24%"
          containScroll="trimSnaps"
          slideGap="md"
          loop
          align="start"
          breakpoints={[
            { maxWidth: "md", slideSize: "50%" },
            { maxWidth: "sm", slideSize: "100%" },
          ]}
          styles={(theme) => ({
            control: {
              width: 30,
              height: 30,
              backgroundColor: theme.colors.primary[0],
              color: "white",
            },
          })}
        >
          {properties?.map((item: PropertyProps) => (
            <Carousel.Slide key={item.id} className="h-full w-[300px]">
              <HomeCard data={item} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}
