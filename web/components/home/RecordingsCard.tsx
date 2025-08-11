"use client";

import {
  Box,
  Button,
  CopyButton,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import VideoIcon from "../icons/Video";
import { PlayIcon } from "../icons/Play";
import { CallRecording } from "@stream-io/video-react-sdk";
import dayjs from "dayjs";
import { CopyIcon } from "../icons/Copy";
import Link from "next/link";

const RecordingsCard = ({ recordings }: { recordings: CallRecording }) => {
  return (
    <Box className="w-full max-w-[533px] bg-dark-0 rounded-[14px] p-6">
      <VideoIcon size={30} />
      <Box mt={20}>
        <Title
          order={1}
          fz={20}
          fw={700}
          ff="Nunito_sans_bold"
          c="light_colors.4"
          mb={6}
        >
          {recordings?.filename.substring(0, 20)}
        </Title>
        <Stack gap={7} mb={25}>
          <Group gap={20}>
            <Text fz={16} fw={400} ff="Nunito_sans_regular" c="light_colors.2">
              Start Time:
              <strong className="ml-2">{`${new Date(
                recordings?.start_time
              ).getHours()} : ${new Date(
                recordings?.start_time
              ).getMinutes()} : ${new Date(
                recordings?.start_time
              ).getSeconds()}`}</strong>
            </Text>
            <Text fz={16} fw={400} ff="Nunito_sans_regular" c="light_colors.2">
              End Time:
              <strong className="ml-2">{`${new Date(
                recordings?.end_time
              ).getHours()} : ${new Date(
                recordings?.end_time
              ).getMinutes()} : ${new Date(
                recordings?.end_time
              ).getSeconds()}`}</strong>
            </Text>
          </Group>
          <Text fz={16} fw={400} ff="Nunito_sans_regular" c="light_colors.2">
            Date:
            <strong className="ml-2">
              {dayjs(recordings?.start_time).format("DD MMM, YYYY")}
            </strong>
          </Text>
        </Stack>
        <Flex gap={6} align={"center"}>
          <Button
            component={Link}
            href={recordings?.url}
            target="_blank"
            h={40}
            fullWidth
            variant="white"
            radius={4}
            bg="other_colors.2"
            color="light_colors.0"
            tt="capitalize"
            fw={500}
            ff="Nunito_sans_medium"
            fz={16}
            leftSection={<PlayIcon />}
          >
            play
          </Button>
          <CopyButton value={recordings?.url}>
            {({ copied, copy }) => (
              <Button
                leftSection={<CopyIcon />}
                h={40}
                fullWidth
                variant="white"
                radius={4}
                bg="dark_colors.3"
                color="light_colors.0"
                tt="capitalize"
                ff="Nunito_sans_medium"
                fz={16}
                fw={500}
                onClick={copy}
              >
                {copied ? "Copied link" : "Copy link"}
              </Button>
            )}
          </CopyButton>
        </Flex>
      </Box>
    </Box>
  );
};

export default RecordingsCard;
