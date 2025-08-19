import InitialLoader from "@/components/InitialLoader";
import CategoryBox from "@/components/global/article/CategoryBox";
import OurArticles from "@/components/home/OurArticles";
import AllPropertyLayout from "@/components/layout/AllPropertyLayout";
import useArticles from "@/hooks/useArticles";
import { articleImageLoader } from "@/services/utils";
import {
  Box,
  Text,
  Paper,
  TypographyStylesProvider,
  Container,
} from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

export default function ArticleDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { articles, loading } = useArticles({
    src: `get_articles?id=${id}`,
  });
  const { articles: similar } = useArticles({
    src: `get_articles?id=${id}&get_similar=1`,
  });

  return (
    <AllPropertyLayout>
      {loading ? (
        <InitialLoader />
      ) : (
        <main>
          <Container size={1248}>
            <Box className="w-full h-full pt-[50px] pb-10 xl:flex xl:space-x-7 space-y-4 xl:space-y-0 ">
              <Box className="flex-1 ">
                <Paper withBorder radius={10} className="w-full p-5 ">
                  <Box className="h-[150px] md:h-[413px] relative w-full max-w-[1033px] mb-10 ">
                    <Image
                      src={articles[0]?.image}
                      alt="article image"
                      loader={articleImageLoader}
                      fill
                      sizes="(min-width: 808px) 50vw, 100vw"
                      priority
                    />
                  </Box>
                  <Text
                    mb={20}
                    fw={500}
                    className="font-manrope-medium text-black normal-case text-xl lg:text-[30px] "
                  >
                    {articles[0]?.title}
                  </Text>
                  <Box mb={20}>
                    <TypographyStylesProvider>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: articles[0]?.description,
                        }}
                      />
                    </TypographyStylesProvider>
                  </Box>
                </Paper>
              </Box>
              <CategoryBox setId={() => {}} show={false} />
            </Box>
          </Container>
          {similar?.length !== 0 && (
            <Box className="w-full px-3 bg-appBg-600 pb-20  ">
              <OurArticles isHome={false} articles={similar ?? []} />
            </Box>
          )}
        </main>
      )}
    </AllPropertyLayout>
  );
}
