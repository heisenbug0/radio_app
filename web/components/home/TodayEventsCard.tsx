"use client";

import {
  Box,
  Button,
  Flex,
  Group,
  Text,
  Title,
  CopyButton,
} from "@mantine/core";
import { NextEventIcon } from "../icons/NextEvent";
import GroupAvatar from "./GroupAvatar";
import { CopyIcon } from "../icons/Copy";
import { Call } from "@stream-io/video-react-sdk";
import Link from "next/link";

const TodayEventsCard = ({ meeting }: { meeting: Call }) => {
  return (
    <Box className="w-full max-w-[533px] bg-dark-0 rounded-[14px] p-6">
      <NextEventIcon size={30} />
      <Box mt={20}>
        <Title
          order={1}
          fz={20}
          tt="capitalize"
          fw={700}
          ff="Nunito_sans_bold"
          c="light_colors.4"
          mb={6}
          lineClamp={2}
        >
          {meeting?.state?.custom?.description}
        </Title>
        <Group gap={4} mb={25}>
          <Text fz={16} fw={400} ff="Nunito_sans_regular" c="light_colors.2">
            {meeting?.state?.startsAt?.toLocaleString()}
          </Text>
        </Group>
        <Box className="lg:flex lg:justify-between lg:items-center lg:space-x-4 space-y-5 lg:space-y-0">
          <GroupAvatar />
          <Flex gap={6} align={"center"}>
            <Button
              component={Link}
              href={`/meeting/${meeting?.id}`}
              h={40}
              w={79}
              variant="white"
              radius={4}
              bg="other_colors.2"
              color="light_colors.0"
              tt="capitalize"
              fw={500}
              ff="Nunito_sans_medium"
              fz={16}
            >
              start
            </Button>
            <CopyButton
              value={`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting?.id}`}
            >
              {({ copied, copy }) => (
                <Button
                  leftSection={<CopyIcon />}
                  h={40}
                  w={177}
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
    </Box>
  );
};

export default TodayEventsCard;
