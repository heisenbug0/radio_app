import useCategories from "@/hooks/useCategories";
import { Paper, Group, Divider, Box, Text, ActionIcon } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function CategoryBox({
  setId,
  show,
}: {
  setId: (id: string) => void;
  show: boolean;
}) {
  const { allCategories } = useCategories();
  const router = useRouter();

  function handleRoute(id: string) {
    router.push("/articles", undefined, { scroll: false });
    setId(id);
  }
  return (
    <Paper
      withBorder
      radius={12}
      className="w-full xl:max-w-[351px] bg-white rounded-lg h-fit"
    >
      <Group position="apart" p={16}>
        <Text className="capitalize font-manrope-bold text-base">
          categories
        </Text>
        {show && (
          <ActionIcon
            onClick={() => setId("")}
            variant="transparent"
            className="w-fit capitalize text-sm font-manrope-medium"
          >
            clear filter
          </ActionIcon>
        )}
      </Group>
      <Divider />
      <Box p={16}>
        {allCategories?.map((cat: AllCategoriesProps) => (
          <Group
            key={cat.id}
            className="cursor-pointer"
            onClick={() =>
              show
                ? handleRoute(cat.id.toString())
                : router.push(`/articles?id=${cat.id}`)
            }
            position="apart"
            mb={10}
          >
            <Text className="text-base capitalize text-gray-800">
              {cat.category}
            </Text>
            <IconChevronRight size={23} className="text-gray-800 " />
          </Group>
        ))}
      </Box>
    </Paper>
  );
}
