import { Box, Container, Flex, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import BlogCard from "./cards/BlogCard";
import { useLocalStyles } from "@/data/usestyles";
import Link from "next/link";

export default function OurArticles({
  isHome,
  articles,
}: {
  isHome: boolean;
  articles: ArticleProps[];
}) {
  const { classes } = useLocalStyles();

  return (
    <Container size={1248}>
      <Box>
        <Box mb={20}>
          {!isHome ? (
            <Box className="w-full flex space-x-6 justify-between items-center">
              <Box className="flex-1">
                <Text
                  span
                  className="text-neutral-800 font-manrope-extrabold capitalize text-xl md:text-[30px]  "
                >
                  related
                </Text>
                <Text
                  span
                  className="text-neutral-100 px-3 font-manrope-extrabold ml-3 bg-primary-700 text-xl md:text-[30px] "
                >
                  Articles
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              <Flex
                gap={24}
                justify="space-between"
                direction={{ base: "column", sm: "row" }}
                mb={38}
              >
                <Box w="100%" maw={300}>
                  <Text className="font-manrope-bold text-[30px] ">
                    Stay Informed with Our Articles
                  </Text>
                </Box>
                <Box w="100%" maw={558}>
                  <Text
                    fz={{ base: 16 }}
                    className="font-manrope-regular"
                    mb={13}
                  >
                    Explore our collection of articles to gain valuable tips,
                    market trends, and investment advice to make informed
                    property decisions
                  </Text>
                  <Text
                    fz={{ base: 14 }}
                    className="font-manrope-semibold"
                    c="primary.0"
                    component={Link}
                    href="/articles"
                  >
                    View all articles
                  </Text>
                </Box>
              </Flex>
            </>
          )}
        </Box>
        <Box className="w-full" mb={30}>
          <Carousel
            classNames={classes}
            controlSize={25}
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
              control: {
                width: 40,
                height: 40,
                backgroundColor: theme.colors.primary[0],
                color: "white",
              },
            })}
          >
            {articles?.map((item: ArticleProps) => (
              <Carousel.Slide key={item.id}>
                <BlogCard article={item} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Container>
  );
}
