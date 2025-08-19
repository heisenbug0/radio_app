import { Box, Container, SimpleGrid, Skeleton } from "@mantine/core";
import FeatureListingHeader from "./FeatureListingHeader";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";
import HomeCard from "./cards/HomeCard";

export default function RecentProperties() {
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?&current_user=${user?.id}`,
  });

  return (
    <>
      {!loading && properties?.length === 0 ? (
        <></>
      ) : (
        <>
          <Container size={1248}>
            <div className="w-full mb-2 ">
              <Box mb={20}>
                <FeatureListingHeader
                  title="our properties listing"
                  link="/properties"
                />
              </Box>
              <Box className="w-full" mb={60}>
                <SimpleGrid
                  cols={3}
                  spacing={44}
                  breakpoints={[
                    { maxWidth: "62rem", cols: 3, spacing: "md" },
                    { maxWidth: "48rem", cols: 2, spacing: "sm" },
                    { maxWidth: "36rem", cols: 1, spacing: "sm" },
                  ]}
                  className="w-full "
                >
                  {loading ? (
                    <>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item: number) => (
                        <Skeleton key={item} height={250} className="w-full " />
                      ))}
                    </>
                  ) : (
                    <>
                      {properties?.map((item: PropertyProps) => (
                        <HomeCard key={item.id} data={item} />
                      ))}
                    </>
                  )}
                </SimpleGrid>
              </Box>
            </div>
          </Container>
        </>
      )}
    </>
  );
}
