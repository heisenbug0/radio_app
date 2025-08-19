import { articleImageLoader } from "@/services/utils";
import {
  Paper,
  Box,
  Text,
  Divider,
  Button,
  Avatar,
  Group,
  Flex,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";

export default function BlogCard({ article }: { article: ArticleProps }) {
  const router = useRouter();
  return (
    <Paper
      withBorder
      radius={10}
      className="w-full overflow-hidden bg-[#F4F5F4] "
    >
      <Box className="w-full p-4">
        <Box className="w-full h-[160px] relative bgOverlay rounded-lg overflow-hidden ">
          <Image
            src={article?.image}
            alt="article image"
            loader={articleImageLoader}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            priority
          />
        </Box>
      </Box>
      <Box className="w-full px-4 pb-4">
        <Text
          lineClamp={1}
          className="text-sm normal-case font-manrope-bold text-black "
        >
          {article?.title}
        </Text>
        <Text
          lineClamp={1}
          className="text-sm capitalize font-manrope-medium mt-1 text-black/60 "
        >
          category: {article?.category.category}
        </Text>
      </Box>
      <Divider />
      <Flex gap={10} p={8} justify="space-between">
        <Flex gap={5} align="center">
          <Avatar
            src={null}
            alt="no image here"
            size={40}
            radius="xl"
            color="red.6"
          />
          <Box>
            <Text
              fz={13}
              className="text-black font-manrope-semibold capitalize"
            >
              by admin
            </Text>
            <Text className="text-black font-manrope-light normal-case text-xs">
              {dayjs(article?.created_at).format("DD MMM, YYYY")}
            </Text>
          </Box>
        </Flex>
        <Button
          onClick={() => router.push(`/articles/${article?.id}`)}
          mt={10}
          variant="subtle"
          rightIcon={<IconArrowRight size={15} />}
          className="text-primary-700 font-manrope-regular font-normal p-0 hover:bg-inherit text-xs"
        >
          Read more
        </Button>
      </Flex>
    </Paper>
  );
}
