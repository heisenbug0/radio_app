import { Text, Box, Flex } from "@mantine/core";
import SearchBox from "../SearchBox";

export default function HomeHero() {
  return (
    <Box
      h={{ base: "auto", md: 631 }}
      w="100%"
      mb={60}
      pos="relative"
      className="overflow-hidden home_banner_overlay"
    >
      <Flex
        w="100%"
        h="100%"
        justify="center"
        align={{ base: "self-start", sm: "center" }}
        p={{ base: 16, sm: 24 }}
      >
        <Box maw={1045} h={{ base: "auto", md: 390 }} w="100%">
          <Box mb={28}>
            <Text
              c="dark.9"
              fz={{ base: 26, sm: 40 }}
              fw={600}
              className="font-manrope-semibold"
              mb={8}
            >
              Find your dream property with ease
            </Text>
            <Text
              c="dark.4"
              fz={{ base: 14 }}
              fw={400}
              className="font-manrope-regular"
            >
              90% of all millionaires around the world INVEST in REAL ESTATE
            </Text>
          </Box>
          <SearchBox />
        </Box>
      </Flex>
    </Box>
  );
}
