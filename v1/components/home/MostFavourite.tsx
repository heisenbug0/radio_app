import { Box, Skeleton, rem } from "@mantine/core";
import FeatureListingHeader from "./FeatureListingHeader";
import HomeCard from "./cards/HomeCard";
import { Carousel } from "@mantine/carousel";
import useProperties from "@/hooks/useProperties";
import useUser from "@/hooks/useUser";

export default function MostFavourite() {
  const { user } = useUser();
  const { properties, loading } = useProperties({
    src: `get_property?most_liked=1&current_user=${user?.id}`,
  });

  return (
    <>
      {!loading && properties?.length === 0 ? (
        <></>
      ) : (
        <Box pt={20}>
          <Box mb={20}>
            <FeatureListingHeader
              title="most favourite properties"
              link="/properties//most-favourite-properties"
            />
          </Box>
          <Box className="w-full" mb={60}>
            <Carousel
              withIndicators
              slideSize="24%"
              containScroll="trimSnaps"
              slideGap="md"
              loop
              align="start"
              breakpoints={[
                { maxWidth: "lg", slideSize: "33%" },
                { maxWidth: "md", slideSize: "50%" },
                { maxWidth: "sm", slideSize: "100%" },
              ]}
              styles={(theme) => ({
                indicators: {
                  bottom: -40,
                },
                indicator: {
                  width: rem(20),
                  height: rem(20),
                  transition: "width 250ms ease",
                  backgroundColor: theme.colors.primary[0],
                },
                control: {
                  border: "none",
                  borderWidth: 0,
                  transition: "opacity 150ms ease",
                  opacity: 0,
                },
              })}
            >
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item: number) => (
                    <Carousel.Slide key={item}>
                      <Skeleton height={300} className="w-full " />
                    </Carousel.Slide>
                  ))}
                </>
              ) : (
                <>
                  {properties?.map((item: PropertyProps) => (
                    <Carousel.Slide key={item.id}>
                      <HomeCard data={item} />
                    </Carousel.Slide>
                  ))}
                </>
              )}
            </Carousel>
          </Box>
        </Box>
      )}
    </>
  );
}
