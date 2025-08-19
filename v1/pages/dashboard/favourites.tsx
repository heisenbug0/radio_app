import HomeCard from "@/components/home/cards/HomeCard";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import useFavourites from "@/hooks/useFavourites";
import { Box, SimpleGrid, Title, Text, Loader } from "@mantine/core";

export default function Favourites() {
  const { favourites, loading } = useFavourites();

  return (
    <UserDashboardLayout>
      <main className="w-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold mb-5">
          favourites
        </Title>
        <Box className="w-full " mb={30}>
          {!loading && favourites?.length === 0 ? (
            <div className="w-full h-[calc(100vh-250px)] flex items-center justify-center">
              <Text className="text-base uppercase font-manrope-medium">
                No favourites
              </Text>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="w-full h-[calc(100vh-250px)] flex items-center justify-center">
                  <Loader color="primary.0" size="lg" variant="bars" />
                </div>
              ) : (
                <SimpleGrid
                  cols={4}
                  spacing="lg"
                  breakpoints={[
                    { maxWidth: "62rem", cols: 2, spacing: "md" },
                    { maxWidth: "48rem", cols: 2, spacing: "sm" },
                    { maxWidth: "36rem", cols: 1, spacing: "sm" },
                  ]}
                  className="w-full "
                >
                  {favourites?.map((item: PropertyProps) => (
                    <HomeCard key={item.id} data={item} />
                  ))}
                </SimpleGrid>
              )}
            </>
          )}
        </Box>
      </main>
    </UserDashboardLayout>
  );
}
Favourites.requireAuth = true;
