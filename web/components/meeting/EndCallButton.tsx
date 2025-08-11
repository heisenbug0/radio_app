"use client";

import { Button, Box } from "@mantine/core";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;
  return (
    <Box>
      <Button
        title="End call"
        tt="capitalize"
        ff="Nunito_sans_medium"
        fw={500}
        bg="red"
        color="light_colors.0"
        variant="white"
        onClick={async () => {
          await call.endCall();
          router.replace("/");
        }}
      >
        end call
      </Button>
    </Box>
  );
};

export default EndCallButton;
