"use client";

import { Box, Group, Text, Title } from "@mantine/core";
import GroupAvatar from "./GroupAvatar";
import { PrevEventIcon } from "../icons/PrevEvent";
import { Call } from "@stream-io/video-react-sdk";

const PrevEventsCard = ({ meeting }: { meeting: Call }) => {
  return (
    <Box className="w-full max-w-[533px] bg-dark-0 rounded-[14px] p-6">
      <PrevEventIcon size={35} />
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
          {meeting?.state?.custom?.description || "Personal Meeting"}
        </Title>
        <Group gap={4} mb={25}>
          <Text fz={16} fw={400} ff="Nunito_sans_regular" c="light_colors.2">
            {meeting?.state?.startsAt?.toLocaleString()}
          </Text>
        </Group>
        <GroupAvatar />
      </Box>
    </Box>
  );
};

export default PrevEventsCard;
