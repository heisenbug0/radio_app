import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useProperties from "@/hooks/useProperties";
import SearchBox from "@/components/home/SearchBox";
import { SimpleGrid, Text } from "@mantine/core";
import HomeCard from "@/components/home/cards/HomeCard";
import InitialLoader from "@/components/InitialLoader";
import { useContext } from "react";
import { SearchContext } from "@/context/SearchContext";

export default function SearchPage() {
  const queries = useContext(SearchContext).queries;
  const minPrice = queries?.priceRange?.split("-")[0];
  const maxPrice = queries?.priceRange?.split("-")[1];
  const { properties, loading } = useProperties({
    src: `get_property?category_id=${queries.categoryId}&min_price=${minPrice}&max_price=${maxPrice}&search=${queries.searchInput}&property_type=${queries.propType}&city=${queries.city}&country=${queries.country}`,
  });

  return (
    <AllPropertyLayout>
      <main className="w-full bg-white">
        <div className="w-full px-3 py-8">
          <SearchBox />
        </div>
        {loading ? (
          <InitialLoader />
        ) : (
          <>
            {properties?.length !== 0 ? (
              <div className="w-full h-full pb-28 px-4 md:px-8 xl:px-4 xl:flex xl:space-x-7 space-y-4 xl:space-y-0 ">
                <SimpleGrid
                  cols={4}
                  spacing="md"
                  breakpoints={[
                    { maxWidth: "62rem", cols: 3, spacing: "md" },
                    { maxWidth: "48rem", cols: 2, spacing: "sm" },
                    { maxWidth: "36rem", cols: 1, spacing: "sm" },
                  ]}
                  className="w-full "
                >
                  {properties.map((item: PropertyProps) => (
                    <HomeCard key={item.id} data={item} />
                  ))}
                </SimpleGrid>
              </div>
            ) : (
              <Text
                ta="center"
                fw={600}
                className="font-manrope-semibold"
                fz={20}
                tt="capitalize"
                py={20}
              >
                no properties found...
              </Text>
            )}
          </>
        )}
      </main>
    </AllPropertyLayout>
  );
}
