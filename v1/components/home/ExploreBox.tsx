import {
  Box,
  Button,
  Container,
  Flex,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import useCategories from "@/hooks/useCategories";
import { useRouter } from "next/router";
import HomeExploreCatCard from "./HomeExploreCatCard";

export default function ExploreBox() {
  const { allCategories, loading } = useCategories();
  const router = useRouter();

  return (
    <Container size={1248} mt={{ base: 0, sm: 60 }} mb={60}>
      <Box>
        <Flex
          gap={24}
          justify="space-between"
          direction={{ base: "column", sm: "row" }}
          mb={38}
        >
          <Box w="100%" maw={400}>
            <Text mb={10} className="capitalize font-manrope-bold text-[30px] ">
              explore our property categories
            </Text>
            <Button
              onClick={() => router.push("/categories")}
              variant="white"
              leftIcon={<IconEye />}
              fz={14}
              c="white"
              className="bg-primary-700 rounded-full text-white "
            >
              View all
            </Button>
          </Box>
          <Box w="100%" maw={528}>
            <Text fz={{ base: 14, sm: 20 }} className="font-manrope-regular">
              Browse through a wide range of property categories, whether
              you&apos;re searching for a land, office space friendly apartment,
              or a spacious family home. Discover spaces tailored to your
              lifestyle and budget.
            </Text>
          </Box>
        </Flex>

        {loading ? (
          <Flex gap={20} direction={{ base: "column", md: "row" }}>
            <Stack spacing={20} w="100%">
              <Skeleton height={300} className="w-full " />{" "}
              <Skeleton height={300} className="w-full " />
            </Stack>
            <Stack spacing={20} h={{ base: "100%", md: 620 }} w="100%">
              <Skeleton height={300} className="w-full " />
              <Flex gap={20} direction={{ base: "column", sm: "row" }}>
                <Skeleton height={300} className="w-full " />
                <Skeleton height={300} className="w-full " />
              </Flex>
            </Stack>
          </Flex>
        ) : (
          <Flex gap={20} direction={{ base: "column", md: "row" }}>
            <Stack spacing={20} w="100%">
              <Flex
                gap={20}
                direction={{ base: "column", sm: "row", md: "column" }}
              >
                <HomeExploreCatCard data={allCategories[0]} />
                <HomeExploreCatCard data={allCategories[1]} />
              </Flex>
            </Stack>
            <Stack spacing={20} h={{ base: "100%", md: 620 }} w="100%">
              <HomeExploreCatCard data={allCategories[2]} />
              <Flex gap={20} direction={{ base: "column", sm: "row" }}>
                <HomeExploreCatCard data={allCategories[3]} />
                <HomeExploreCatCard data={allCategories[4]} />
              </Flex>
            </Stack>
          </Flex>
        )}
      </Box>
    </Container>
  );
}
