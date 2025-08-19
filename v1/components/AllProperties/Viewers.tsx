import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import OnlineViewerCard from "./OnlineViewerCard";
import { useRouter } from "next/router";

export default function Viewers({ data }: { data: PropertyProps }) {
  const router = useRouter();
  return (
    <Paper
      withBorder
      radius={8}
      className="w-full max-w-[349px] h-fit bg-white p-5"
    >
      <Tabs defaultValue="online" color="primary.0">
        <Tabs.List>
          <Tabs.Tab
            className="capitalize text-sm font-manrope-medium font-medium"
            value="online"
            icon={<IconEye size={16} />}
          >
            online viewers
          </Tabs.Tab>
          <Tabs.Tab
            className="capitalize text-sm font-manrope-medium font-medium"
            value="offline"
            icon={<IconEyeOff size={16} />}
          >
            offline viewers
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="online" pt="xs">
          <Stack>
            <OnlineViewerCard />
          </Stack>
          <Group position="right" className="">
            <ActionIcon
              onClick={() => router.push("/dashboard/online-viewers")}
              mt={20}
              variant="transparent"
              className="w-fit text-black hover:text-primary-700  "
            >
              <Text className="font-semibold font-manrope-semibold italic text-sm capitalize ">
                see more...
              </Text>
            </ActionIcon>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="offline" pt="xs">
          <Box className="pt-2">
            <Box w={200} h={200} className="relative overflow-hidden mx-auto ">
              <Image
                src="/offline-viewers.svg"
                alt="viewer's image"
                fill
                loading="lazy"
                sizes="(min-width: 808px) 50vw, 100vw"
              />
            </Box>
            <Box mt={40}>
              <Text className="font-semibold font-manrope-semibold text-black text-3xl text-center">
                50
              </Text>
              <Text className="font-medium font-manrope-medium text-black text-base text-center">
                people viewed your listing offline!
              </Text>
            </Box>
          </Box>
        </Tabs.Panel>

        <Box mt={20}>
          <Box className="flex space-x-4 justify-center">
            <Button
              fullWidth
              className="bg-primary-700 hover:bg-primary-700 text-white text-sm font-manrope-regular font-normal capitalize rounded-xl"
            >
              edit
            </Button>
            <Button
              fullWidth
              className="bg-black hover:bg-black text-white text-sm font-manrope-regular font-normal capitalize rounded-xl"
            >
              delete
            </Button>
          </Box>
        </Box>
      </Tabs>
    </Paper>
  );
}
