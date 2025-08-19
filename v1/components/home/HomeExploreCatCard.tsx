import { categoryImageLoader } from "@/services/utils";
import { Paper, Box, Text } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";

export default function HomeExploreCatCard({
  data,
}: {
  data: AllCategoriesProps;
}) {
  const router = useRouter();

  return (
    <Paper
      radius={10}
      withBorder
      h={{ base: 300 }}
      w="100%"
      pos="relative"
      className="cursor-pointer overflow-hidden"
      onClick={() =>
        router.push(
          `/categories/${data?.category.toLowerCase()}?id=${data?.id}`
        )
      }
    >
      <Box w="100%" h="100%" pos="relative">
        <Image
          src={data?.icon}
          loader={categoryImageLoader}
          alt={`${data?.category} image`}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
        />
      </Box>
      <div className="absolute bottom-0 rounded-b-[10px] left-0 right-0 bg-[#383235] p-4">
        <Text className="capitalize text-white font-manrope-semibold text-sm ">
          {data?.category}
        </Text>
        <Text className="capitalize text-white font-manrope-medium text-xs ">
          {data?.properties_count !== 1
            ? `${data?.properties_count} properties`
            : `${data?.properties_count} property`}
        </Text>
      </div>
    </Paper>
  );
}
