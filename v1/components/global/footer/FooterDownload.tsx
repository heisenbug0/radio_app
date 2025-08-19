import { Box, Text, Paper, Flex } from "@mantine/core";
import Image from "next/image";

export default function FooterDownload() {
  return (
    <Box>
      <Text
        mb={15}
        fz={26}
        className="capitalize text-white font-manrope-semibold"
      >
        download apps
      </Text>
      <Text mb={30} className="text-white font-manrope-regular text-sm">
        Get the latest resources for downloading, installing, and updating
        eBroker app. Select your device platform and use our app.
      </Text>
      <Flex gap={20} align="center">
        <a href="https://smalee.com/hauslover/download" target="_blank" rel="noopener noreferrer">
          <Paper
            withBorder
            className="bg-inherit flex w-full max-w-[297px] p-2 items-center space-x-3 rounded-lg"
          >
            <Flex align="center" gap={15}>
              <Box className="w-[40px] h-[45px] overflow-hidden relative ">
                <Image
                  src="/playstore.svg"
                  alt="playstore"
                  fill
                  priority
                  sizes="(min-width: 808px) 50vw, 100vw"
                />
              </Box>
              <Box>
                <Text className="uppercase font-manrope-medium text-sm text-white">
                  get it on
                </Text>
                <Text className="font-manrope-medium text-sm text-white">
                  Google play
                </Text>
              </Box>
            </Flex>
          </Paper>
        </a>
        <a href="https://smalee.com/hauslover/download" target="_blank" rel="noopener noreferrer">
          <Paper
            withBorder
            className="bg-inherit flex w-full max-w-[297px] p-2 items-center space-x-3 rounded-lg"
          >
            <Flex align="center" gap={15}>
              <Box className="w-[40px] h-[45px] overflow-hidden relative ">
                <Image
                  src="/applestore.svg"
                  alt="apptore"
                  fill
                  priority
                  sizes="(min-width: 808px) 50vw, 100vw"
                />
              </Box>
              <Box>
                <Text className="normal-case font-manrope-medium text-sm text-white">
                  Download on the
                </Text>
                <Text className="capitalize font-manrope-medium text-sm text-white">
                  App store
                </Text>
              </Box>
            </Flex>
          </Paper>
        </a>
      </Flex>
    </Box>
  );
}
