import { Flex, Button, CopyButton } from "@mantine/core";
import { CopyIcon } from "../icons/Copy";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import useGetCallById from "@/hooks/useGetCallById";
import { useRouter } from "next/navigation";

const RoomButtons = ({
  meetingLink,
  meetingId,
}: {
  meetingLink: string;
  meetingId: string;
}) => {
  const client = useStreamVideoClient();
  const { call } = useGetCallById(meetingId!);
  const router = useRouter();

  const startRoom = async () => {
    if (!client || !meetingId) return;
    if (!call) {
      const newCall = client.call("default", meetingId);
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }
    router.push(`/meeting/${meetingId}?personal=true`);
  };
  return (
    <Flex gap={10} align={"center"} my={30} wrap={"wrap"}>
      <Button
        onClick={startRoom}
        h={40}
        fullWidth
        maw={177}
        variant="white"
        radius={4}
        bg="other_colors.2"
        color="light_colors.0"
        fw={500}
        ff="Nunito_sans_medium"
        fz={13}
      >
        Start meeting
      </Button>
      <CopyButton value={meetingLink}>
        {({ copied, copy }) => (
          <Button
            leftSection={<CopyIcon />}
            h={40}
            fullWidth
            maw={177}
            variant="white"
            radius={4}
            bg="dark_colors.3"
            color="light_colors.0"
            tt="capitalize"
            ff="Nunito_sans_medium"
            fz={13}
            fw={500}
            onClick={copy}
          >
            {copied ? "Copied link" : "Copy link"}
          </Button>
        )}
      </CopyButton>
    </Flex>
  );
};

export default RoomButtons;
