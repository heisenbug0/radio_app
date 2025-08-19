import { Group, Paper, Box, Button } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";
import Image from "next/image";

export default function OnlineViewerCard() {
  return (
    <Group position="apart">
      <Paper
        w={56}
        h={56}
        withBorder
        className="rounded-full flex justify-center items-center "
      >
        <Box w={48} h={48} className="rounded-full relative overflow-hidden">
          <Image
            src="/banner/banner1.jpg"
            alt="viewer's image"
            fill
            loading="lazy"
            sizes="(min-width: 808px) 50vw, 100vw"
          />
        </Box>
      </Paper>
      <Button
        leftIcon={<IconMessage />}
        className="bg-primary-700 hover:bg-primary-700 text-white text-sm font-manrope-regular font-normal capitalize rounded-2xl"
      >
        chat
      </Button>
    </Group>
  );
}
