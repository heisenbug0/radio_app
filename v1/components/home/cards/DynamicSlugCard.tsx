import PropertiesLongCard from "@/components/AllProperties/PropertiesLongCard";
import {
  SimpleGrid,
  Skeleton,
  Box,
  Paper,
  Group,
  ActionIcon,
  Text,
} from "@mantine/core";
import { IconList, IconGridDots } from "@tabler/icons-react";
import HomeCard from "./HomeCard";
import { useState } from "react";

export default function DynamicSlugCard({
  properties,
  loading,
}: {
  properties: PropertyProps[];
  loading: boolean;
}) {
  const [display, setDisplay] = useState("list");
  return (
    <>
      {loading ? (
        <>
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
            {[1, 2, 3, 4, 5, 6].map((item: number) => (
              <Skeleton key={item} height={250} className="w-full " />
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Box className="flex-1 ">
          <Paper
            withBorder
            radius={10}
            className="w-full h-[60px] flex items-center px-4 mb-7"
          >
            <Group position="apart" className="w-full">
              <Text className="text-black capitalize font-manrope-bold">
                {properties?.length !== 1
                  ? `${properties?.length} properties found`
                  : `${properties?.length} property found`}
              </Text>
              <Group spacing={6}>
                <Paper withBorder radius={5}>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => setDisplay("list")}
                  >
                    <IconList
                      className={`${
                        display === "list" ? "text-primary-700" : "text-black"
                      }`}
                    />
                  </ActionIcon>
                </Paper>
                <Paper withBorder radius={5}>
                  <ActionIcon
                    variant="transparent"
                    onClick={() => setDisplay("grid")}
                  >
                    <IconGridDots
                      className={`${
                        display === "grid" ? "text-primary-700" : "text-black"
                      }`}
                    />
                  </ActionIcon>
                </Paper>
              </Group>
            </Group>
          </Paper>
          <Box className="w-full">
            {display === "list" ? (
              <SimpleGrid
                cols={1}
                spacing="md"
                breakpoints={[
                  { maxWidth: "62rem", cols: 2, spacing: "md" },
                  { maxWidth: "48rem", cols: 2, spacing: "sm" },
                  { maxWidth: "36rem", cols: 1, spacing: "sm" },
                ]}
                className="w-full "
              >
                {properties.map((item: PropertyProps) => (
                  <PropertiesLongCard key={item.id} data={item} />
                ))}
              </SimpleGrid>
            ) : (
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
                {properties.map((item: PropertyProps) => (
                  <HomeCard key={item.id} data={item} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
