import { Modal, Button, Title, Box, CloseButton } from "@mantine/core";
import classes from "./modal.module.css";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { customNotification } from "@/services/custom_notify";

const InstantMeeting = ({
  show,
  hide,
}: {
  show: boolean;
  hide: (show: boolean) => void;
}) => {
  const [loader, setLoader] = useState<boolean>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();

  const startInstantMeeting = async () => {
    setLoader(true);
    if (!client || !user) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Call failed to start!");

      const startedAt =
        new Date().toISOString() || new Date(Date.now()).toISOString();
      const description = "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startedAt,
          custom: {
            color: "blue",
            description,
          },
        },
      });
      customNotification("Instant meeting started!");
      router.push(`/meeting/${call.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <>
      <Modal
        withCloseButton={false}
        opened={show}
        onClose={() => hide(false)}
        transitionProps={{
          transition: "slide-up",
          duration: 600,
          timingFunction: "linear",
        }}
        classNames={{
          content: classes.modal_body_no_title,
          close: classes.modal_close,
        }}
        centered
      >
        <Box pos={"relative"}>
          <Box pos={"absolute"} right={10} top={-4} onClick={() => hide(false)}>
            <CloseButton c="light_colors.0" variant="transparent" />
          </Box>
          <Title
            order={1}
            fz={30}
            c="light_colors.0"
            tt="capitalize"
            fw={700}
            ff="Nunito_sans_bold"
            mb={20}
            ta={"center"}
          >
            instant meeting
          </Title>
          <Button
            onClick={startInstantMeeting}
            type="button"
            h={40}
            fullWidth
            variant="white"
            radius={4}
            bg="other_colors.2"
            color="light_colors.0"
            fw={500}
            ff="Nunito_sans_medium"
            fz={16}
            tt="capitalize"
            loading={loader}
          >
            start meeting
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default InstantMeeting;
