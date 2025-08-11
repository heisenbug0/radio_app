import { Box, Checkbox, Title, Button, Group } from "@mantine/core";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamOn, setIsMicCamOn] = useState<boolean>(true);
  const call = useCall();
  const router = useRouter();

  if (!call) {
    throw new Error("useCall must be used inside StreamCall component");
  }

  useEffect(() => {
    if (isMicCamOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamOn, call?.microphone, call?.camera]);

  return (
    <Box className="h-screen w-full flex flex-col space-y-2 justify-center items-center py-4 ">
      <Title
        order={1}
        fz={30}
        c="light_colors.0"
        tt="capitalize"
        fw={700}
        ff="Nunito_sans_bold"
        ta={"center"}
      >
        setup
      </Title>
      <VideoPreview className="h-full w-full" />
      <Group gap={10} mt={10}>
        <Checkbox
          checked={isMicCamOn}
          label="Join with mic & camera off"
          color="dark"
          c="light_colors.0"
          fw={500}
          ff="Nunito_sans_medium"
          onChange={(e) => setIsMicCamOn(e.currentTarget.checked)}
        />
        <DeviceSettings />
      </Group>
      <Box className="flex space-x-3">
        <Button
          bg="green.6"
          color="light_colors.0"
          tt="capitalize"
          ff="Nunito_sans_medium"
          fw={500}
          variant="white"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          join meeting
        </Button>
        <Button
          onClick={() => {
            call?.camera.disable();
            call?.microphone.disable();
            router.replace("/");
          }}
          bg="red.6"
          color="light_colors.0"
          tt="capitalize"
          ff="Nunito_sans_medium"
          fw={500}
          variant="white"
        >
          abort
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingSetup;
