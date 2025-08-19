import useUser from "@/hooks/useUser";
import {
  SimpleGrid,
  Paper,
  Title,
  Group,
  Box,
  Text,
  BackgroundImage,
  Loader,
} from "@mantine/core";
import { IconEye, IconHome2 } from "@tabler/icons-react";

export default function OVerviewCardsBox({
  totalProps,
  totalViews,
}: {
  totalProps: number;
  totalViews: number;
}) {
  const { user, loading, error } = useUser();
  return (
    <SimpleGrid
      cols={3}
      spacing="md"
      breakpoints={[
        { maxWidth: "62rem", cols: 2, spacing: "md" },
        { maxWidth: "48rem", cols: 2, spacing: "sm" },
        { maxWidth: "36rem", cols: 1, spacing: "sm" },
      ]}
    >
      <BackgroundImage
        src="/b1.jpg"
        className="w-full max-w-[460px] h-[130px] overflow-hidden rounded-[10px] "
      >
        <Paper
          radius={10}
          className="w-full h-[130px] flex flex-col justify-center bg-black/50 p-5"
        >
          {loading ? (
            <div className="w-full flex justify-center">
              <Loader color="gray.0" size="sm" variant="bars" />
            </div>
          ) : (
            <>
              <Title className="text-3xl capitalize font-manrope-semibold mb-2 text-white">
                hy, {user?.name.split(" ")[0]}
              </Title>
              <Text className="text-sm font-manrope-medium text-white">
                Manage your profile and view property
              </Text>
            </>
          )}
        </Paper>
      </BackgroundImage>
      <Paper
        withBorder
        radius={10}
        className="w-full max-w-[460px] h-[130px] bg-white flex items-center p-5"
      >
        <Group position="apart" className="w-full">
          <Box className="flex-1">
            <Title className="text-base capitalize font-manrope-regular mb-0.5">
              total properties
            </Title>
            <Text className="text-2xl capitalize font-manrope-medium ">
              {Number(totalProps).toLocaleString()}
            </Text>
          </Box>
          <Box className="w-[70px] h-[70px] rounded-full bg-black flex items-center justify-center">
            <IconHome2 size={30} className="text-white" />
          </Box>
        </Group>
      </Paper>
      <Paper
        withBorder
        radius={10}
        className="w-full max-w-[460px] h-[130px] bg-white flex items-center p-5"
      >
        <Group position="apart" className="w-full">
          <Box className="flex-1">
            <Title className="text-base capitalize font-manrope-regular mb-0.5">
              total views
            </Title>
            <Text className="text-2xl capitalize font-manrope-medium ">
              {Number(totalViews).toLocaleString()}
            </Text>
          </Box>
          <Box className="w-[70px] h-[70px] rounded-full bg-black flex items-center justify-center">
            <IconEye size={30} className="text-white" />
          </Box>
        </Group>
      </Paper>
    </SimpleGrid>
  );
}
