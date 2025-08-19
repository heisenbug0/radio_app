import AppLayout from "@/components/layout/AppLayout";
import FeaturedBox from "@/components/home/FeaturedBox";
import ExploreBox from "@/components/home/ExploreBox";
import Nearby from "@/components/home/Nearby";
import OurArticles from "@/components/home/OurArticles";
import InitialLoader from "@/components/InitialLoader";
import useArticles from "@/hooks/useArticles";
import RecentProperties from "@/components/home/RecentProperties";
import { Box } from "@mantine/core";
import useGetter from "@/hooks/useGetter";

export default function Home() {
  const { loading } = useGetter(`list/reels`);
  const { articles } = useArticles({
    src: "get_articles",
  });
  const carouselArticles: ArticleProps[] = articles?.slice(0, 10) ?? [];
  return (
    <>
      {loading ? (
        <InitialLoader />
      ) : (
        <AppLayout>
          <main className="w-full pb-6 h-full  ">
            <ExploreBox />
            <FeaturedBox />
            <Box bg="#F4F2F4" py={30} mt={35}>
              <RecentProperties />
              <Nearby />
            </Box>
            {articles?.length !== 0 && (
              <Box py={40} className="w-full px-3   ">
                <OurArticles isHome articles={carouselArticles} />
              </Box>
            )}
          </main>
        </AppLayout>
      )}
    </>
  );
}
