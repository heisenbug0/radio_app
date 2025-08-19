import {
  Box,
  Container,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import FeatureListingHeader from "./FeatureListingHeader";
import { useNearbyCities } from "@/hooks/useProperties";
import NearbySmallCard from "./cards/NearbySmallCard";
import NearbyLargeCard from "./cards/NearbyLargeCard";

export default function Nearby() {
  const { cities, loading } = useNearbyCities();

  return (
    <Box>
      <Container size={1248}>
        {loading ? (
          <SimpleGrid
            cols={3}
            spacing="lg"
            breakpoints={[
              { maxWidth: "62rem", cols: 2, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
            ]}
            className="w-full "
          >
            <>
              {[1, 2, 3, 4, 5, 6].map((item: number) => (
                <Skeleton key={item} height={350} className="w-full " />
              ))}
            </>
          </SimpleGrid>
        ) : (
          <>
            <Box mb={20}>
              <FeatureListingHeader
                title="properties nearby cities"
                link="/cities"
              />
            </Box>

            <Flex gap={20} direction={{ base: "column", md: "row" }}>
              {(cities[2]?.image || cities[3]?.image) && (
                <Stack spacing={20} w="100%">
                  <Flex
                    gap={20}
                    direction={{ base: "column", sm: "row", md: "column" }}
                  >
                    <NearbyLargeCard city={cities[2]} />
                    <NearbyLargeCard city={cities[3]} />
                  </Flex>
                </Stack>
              )}

              <Flex
                gap={20}
                direction={{
                  base: "column",
                  sm: "row",
                  md: "column",
                  lg: "row",
                }}
                w="100%"
              >
                <NearbySmallCard city={cities[0]} />
                <NearbySmallCard city={cities[1]} />
              </Flex>
            </Flex>
          </>
        )}
      </Container>
    </Box>
  );
}
