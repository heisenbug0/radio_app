import { SearchContext } from "@/context/SearchContext";
import { priceRangeData } from "@/data/staticFormValues";
import useCategories from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useProperties";
import {
  Paper,
  Box,
  Button,
  Select,
  SimpleGrid,
  Flex,
  Text,
  Divider,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const { city, country } = useLocations();
  const { selectCategories } = useCategories();
  const [value, setValue] = useState<string>("sell");
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const setQueries = useContext(SearchContext).setQueries;
  const searchRef = useRef<HTMLInputElement>(null);
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);

  function handleSearch() {
    const filterData = {
      categoryId: category ?? "",
      priceRange: price ?? "",
      propType: value ?? "",
      city: cityRef?.current?.value ?? "",
      country: countryRef?.current?.value ?? "",
      minPrice: "",
      maxPrice: "",
      searchInput: searchRef?.current?.value ?? "",
      postedSince: "",
      state: "",
    };
    setQueries(filterData);

    if (router.asPath !== "/properties/search") {
      router.push("/properties/search", undefined, { scroll: false });
    }
  }

  return (
    <>
      <Flex gap={0}>
        <Button
          fullWidth
          maw={125}
          type="button"
          variant="white"
          size="lg"
          bg={value === "sell" ? "primary.0" : "white"}
          c={value === "sell" ? "white" : "primary.0"}
          tt="capitalize"
          fw={500}
          className="font-manrope-medium text-base rounded-tl-2xl rounded-none "
          onClick={() => setValue("sell")}
          radius={10}
        >
          sell
        </Button>
        <Button
          fullWidth
          maw={125}
          type="button"
          variant="white"
          size="lg"
          bg={value === "rent" ? "primary.0" : "white"}
          c={value === "rent" ? "white" : "primary.0"}
          tt="capitalize"
          fw={500}
          className="font-manrope-medium text-base rounded-tr-2xl rounded-none "
          onClick={() => setValue("rent")}
          radius={10}
        >
          rent
        </Button>
      </Flex>
      {/* start */}
      <Paper
        radius={0}
        px={{ base: 12, md: 16 }}
        className="w-full relative py-6 rounded-b-2xl rounded-r-2xl "
        bg="white"
        mb={20}
      >
        <Flex gap={20} direction={{ base: "column", md: "row" }}>
          <TextInput
            ref={searchRef}
            size="lg"
            placeholder="Enter a city, country or category!"
            icon={<IconSearch size={20} className="text-neutral-600" />}
            className="w-full"
            styles={(theme) => ({
              input: {
                fontFamily: "manrope-regular",
                fontSize: 14,
                backgroundColor: "transparent",
                borderWidth: 1,
                "&:focus": {
                  borderColor: theme.colors.gray[4],
                },
              },
            })}
          />
          <Box w="100%" className="space-y-3 md:space-y-0 md:flex md:space-x-3">
            <Button
              fullWidth
              type="button"
              onClick={() => setIsAdvanced((prev) => !prev)}
              size="lg"
              color="primary.0"
              variant="outline"
              radius={10}
              className="capitalize font-manrope-medium font-medium text-base hover:bg-white "
            >
              advanced search
            </Button>
            <Button
              fullWidth
              type="button"
              onClick={handleSearch}
              variant="white"
              size="lg"
              bg="white"
              radius={10}
              className="bg-black text-white capitalize font-manrope-medium font-medium text-base hidden md:block"
            >
              search
            </Button>
          </Box>
        </Flex>
        {isAdvanced && (
          <SimpleGrid
            mt={20}
            cols={4}
            spacing="md"
            breakpoints={[
              { maxWidth: "62rem", cols: 3, spacing: "md" },
              { maxWidth: "48rem", cols: 2, spacing: "sm" },
              { maxWidth: "36rem", cols: 1, spacing: "sm" },
            ]}
          >
            <Flex gap={15}>
              <Select
                ref={countryRef}
                maxDropdownHeight={150}
                className="w-full"
                size="lg"
                label="country"
                placeholder="Pick country"
                data={country}
                styles={(theme) => ({
                  label: {
                    fontSize: 14,
                    color: "dark.9",
                    fontFamily: "manrope-semibold",
                    textTransform: "capitalize",
                    fontWeight: 600,
                  },
                  input: {
                    marginTop: 4,
                    borderWidth: 1,
                    fontSize: 12,
                    backgroundColor: "transparent",
                    "&:focus": {
                      borderColor: theme.colors.gray[4],
                    },
                  },
                  item: {
                    // applies styles to selected item
                    fontSize: 13,
                    padding: 5,
                    "&[data-selected]": {
                      "&, &:hover": {
                        backgroundColor: "black",
                      },
                    },
                  },
                })}
              />
              <Divider
                orientation="vertical"
                h={70}
                className="self-end hidden"
              />
            </Flex>
            <Flex gap={15}>
              <Select
                ref={cityRef}
                maxDropdownHeight={150}
                className="w-full"
                size="lg"
                label="city"
                placeholder="Pick city"
                data={city}
                styles={(theme) => ({
                  label: {
                    fontSize: 14,
                    color: "dark.9",
                    fontFamily: "manrope-semibold",
                    textTransform: "capitalize",
                    fontWeight: 600,
                  },
                  input: {
                    marginTop: 4,
                    borderWidth: 1,
                    fontSize: 12,
                    backgroundColor: "transparent",
                    "&:focus": {
                      borderColor: theme.colors.gray[4],
                    },
                  },
                  item: {
                    // applies styles to selected item
                    fontSize: 13,
                    padding: 5,
                    "&[data-selected]": {
                      "&, &:hover": {
                        backgroundColor: "black",
                      },
                    },
                  },
                })}
              />
              <Divider
                orientation="vertical"
                h={70}
                className="self-end hidden"
              />
            </Flex>
            <Flex gap={15}>
              <Select
                value={category}
                onChange={setCategory}
                maxDropdownHeight={150}
                className="w-full"
                size="lg"
                label="property type"
                placeholder="Pick category"
                data={selectCategories}
                styles={(theme) => ({
                  label: {
                    color: "dark.9",
                    fontSize: 14,
                    fontFamily: "manrope-semibold",
                    textTransform: "capitalize",
                    fontWeight: 600,
                  },
                  input: {
                    marginTop: 4,
                    fontSize: 12,
                    borderWidth: 1,
                    backgroundColor: "transparent",
                    "&:focus": {
                      borderColor: theme.colors.gray[4],
                    },
                  },
                  item: {
                    // applies styles to selected item
                    fontSize: 13,
                    padding: 5,
                    "&[data-selected]": {
                      "&, &:hover": {
                        backgroundColor: "black",
                      },
                    },
                  },
                })}
              />
              <Divider
                orientation="vertical"
                h={70}
                className="self-end hidden"
              />
            </Flex>
            <Select
              value={price}
              onChange={setPrice}
              maxDropdownHeight={150}
              className="w-full"
              size="lg"
              label="price range"
              placeholder="Min.Price - Max.Price"
              data={priceRangeData}
              styles={(theme) => ({
                label: {
                  fontSize: 14,
                  color: "dark.9",
                  fontFamily: "manrope-semibold",
                  textTransform: "capitalize",
                  fontWeight: 600,
                },
                input: {
                  marginTop: 4,
                  borderWidth: 1,
                  fontSize: 12,
                  backgroundColor: "transparent",
                  "&:focus": {
                    borderColor: theme.colors.gray[4],
                  },
                },
                item: {
                  // applies styles to selected item
                  fontSize: 13,
                  padding: 5,
                  "&[data-selected]": {
                    "&, &:hover": {
                      backgroundColor: "black",
                    },
                  },
                },
              })}
            />
          </SimpleGrid>
        )}
        <Button
          mt={20}
          fullWidth
          type="button"
          onClick={handleSearch}
          variant="white"
          size="lg"
          bg="white"
          radius={10}
          className="text-white bg-black capitalize font-manrope-medium font-medium text-base md:hidden"
        >
          search
        </Button>
      </Paper>
      {/* end */}
      <Paper bg="#E3E7FF" w="100#" maw={420} radius={10} p={12}>
        <Flex gap={15}>
          <Text
            fz={{ base: 16 }}
            fw={500}
            className="text-black font-manrope-semibold"
          >
            Do You Have Properties to Sell?
          </Text>
          <Text
            component={Link}
            href="https://request.iloverealestates.com"
            target="_blank"
            fw={500}
            fz={16}
            c="primary.0"
            className="font-manrope-medium"
          >
            Click Here
          </Text>
        </Flex>
      </Paper>
    </>
  );
}
