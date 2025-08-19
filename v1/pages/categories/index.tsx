import NextPrevButtons from "@/components/global/NextPrevButtons";
import ExploreCard from "@/components/home/cards/ExploreCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useCategories from "@/hooks/useCategories";
import { SimpleGrid, Skeleton } from "@mantine/core";

export default function AllCategories() {
  const { allCategories, loading } = useCategories();
  return (
    <AllPropertyLayout>
      <main className="w-full">
        <div className="w-full py-10 px-4">
          <SimpleGrid
            cols={6}
            spacing="md"
            breakpoints={[
              { maxWidth: "72rem", cols: 3, spacing: "md" },
              { maxWidth: "62rem", cols: 2, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
            ]}
            className="w-full "
          >
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((item: number) => (
                  <Skeleton key={item} height={250} className="w-full " />
                ))}
              </>
            ) : (
              <>
                {allCategories?.map((category: AllCategoriesProps) => (
                  <ExploreCard key={category.id} data={category} />
                ))}
              </>
            )}
          </SimpleGrid>
          {/* {allCategories?.length !== 0 && <NextPrevButtons />} */}
        </div>
      </main>
    </AllPropertyLayout>
  );
}
