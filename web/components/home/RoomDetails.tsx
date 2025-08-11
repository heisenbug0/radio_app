"use client";

import { Box, Group, ActionIcon, Text } from "@mantine/core";
import Link from "next/link";
import CustomDivider from "./CustomDivider";
import RoomButtons from "./RoomButtons";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const RoomDetails = () => {
  const [show, setShow] = useState<boolean>(false);
  const { user } = useUser();
  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  return (
    <Box className="w-full">
      <Group gap={20}>
        <Text
          fw={500}
          tt="capitalize"
          ff="Nunito_sans_medium"
          c="light_colors.1"
        >
          topic:
        </Text>
        <Text fw={700} tt="capitalize" ff="Nunito_sans_bold" c="light_colors.0">
          {`${user?.username}'s Personal Meeting Room`}
        </Text>
      </Group>
      <Group gap={20} my={15}>
        <Text
          fw={500}
          tt="capitalize"
          ff="Nunito_sans_medium"
          c="light_colors.1"
        >
          Meeting ID:
        </Text>
        <Text fw={700} tt="capitalize" ff="Nunito_sans_bold" c="light_colors.0">
          {meetingId!}
        </Text>
      </Group>
      <Group gap={20} mb={15}>
        <Text
          fw={500}
          tt="capitalize"
          ff="Nunito_sans_medium"
          c="light_colors.1"
        >
          Passcode:
        </Text>
        <Group>
          <Text
            fw={700}
            tt="capitalize"
            ff="Nunito_sans_bold"
            c="light_colors.0"
            fz={14}
          >
            {show ? "SD#SJD22232@" : " ********"}
          </Text>
          <ActionIcon
            onClick={() => setShow((prev) => !prev)}
            w={50}
            variant="transparent"
            fz={18}
            fw={500}
            ff="Nunito_sans_medium"
            color="other_colors.2"
            tt="capitalize"
          >
            show
          </ActionIcon>
        </Group>
      </Group>
      <Group gap={20}>
        <Text
          fw={500}
          tt="capitalize"
          ff="Nunito_sans_medium"
          c="light_colors.1"
        >
          Invite Link:
        </Text>
        <Text
          component={Link}
          href={meetingLink}
          fw={700}
          ff="Nunito_sans_bold"
          c="other_colors.2"
        >
          {meetingLink}
        </Text>
      </Group>
      <RoomButtons meetingLink={meetingLink} meetingId={meetingId as string} />
      <CustomDivider />
    </Box>
  );
};

export default RoomDetails;
