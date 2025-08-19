import InitialLoader from "@/components/InitialLoader";
import CategoryBox from "@/components/global/article/CategoryBox";
import BlogCard from "@/components/home/cards/BlogCard";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useArticles from "@/hooks/useArticles";
import { Box, Group, SimpleGrid, Text, Paper } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Articles() {
  const router = useRouter();
  const { id } = router.query;
  const [cat_id, setCat_id] = useState<string>("");
  const { articles, loading } = useArticles({
    src: `get_articles?category_id=${cat_id}`,
  });

  useEffect(() => {
    if (id) setCat_id(id as string);
  }, [id]);
  return (
    <AllPropertyLayout>
      {loading ? (
        <InitialLoader />
      ) : (
        <main className="w-full h-full pt-[50px] pb-28 px-4 md:px-8 xl:px-4 xl:flex xl:space-x-7 space-y-4 xl:space-y-0 ">
          <Box className="flex-1 ">
            {!loading && articles?.length === 0 ? (
              <div className="w-full h-full py-10 flex items-center justify-center">
                <Text className="text-base uppercase font-manrope-medium">
                  No articles
                </Text>
              </div>
            ) : (
              <>
                <Paper
                  withBorder
                  radius={10}
                  className="w-full h-[60px] flex items-center px-4 mb-5"
                >
                  <Group position="apart" className="w-full">
                    <Text className="text-black capitalize font-manrope-bold">
                      {articles?.length !== 1
                        ? `${articles?.length} articles found`
                        : `${articles?.length} article found`}
                    </Text>
                  </Group>
                </Paper>
                <Box className="w-full">
                  <SimpleGrid
                    cols={3}
                    spacing="md"
                    breakpoints={[
                      { maxWidth: "62rem", cols: 2, spacing: "md" },
                      { maxWidth: "48rem", cols: 2, spacing: "sm" },
                      { maxWidth: "36rem", cols: 1, spacing: "sm" },
                    ]}
                    className="w-full "
                  >
                    {articles?.map((item: ArticleProps) => (
                      <BlogCard key={item.id} article={item} />
                    ))}
                  </SimpleGrid>
                </Box>
              </>
            )}
          </Box>
          <CategoryBox setId={setCat_id} show={true} />
        </main>
      )}
    </AllPropertyLayout>
  );
}
