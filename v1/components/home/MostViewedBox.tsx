import { Box, SimpleGrid, Skeleton } from "@mantine/core";
import FeatureListingHeader from "./FeatureListingHeader";
import MostViewedCard from "./cards/MostViewedCard";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";

export default function MostViewedBox() {
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?top_rated=1&current_user=${user?.id}`,
  });

  return (
    <>
      {!loading && properties?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="w-full px-3 mb-2 ">
            <Box mb={20}>
              <FeatureListingHeader
                title="most viewed properties"
                link="/properties/most-viewed-properties"
              />
            </Box>
            <Box className="w-full" mb={60}>
              <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[
                  { maxWidth: "62rem", cols: 2, spacing: "md" },
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
                      <MostViewedCard key={item.id} data={item} />
                    ))}
                  </>
                )}
              </SimpleGrid>
            </Box>
          </div>
        </>
      )}
    </>
  );
}
