import {
  Modal,
  Button,
  Stack,
  CloseButton,
  Box,
  Title,
  TextInput,
} from "@mantine/core";
import classes from "./modal.module.css";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const JoinMeeting = ({
  openJoin,
  hideJoin,
}: {
  openJoin: boolean;
  hideJoin: (value: boolean) => void;
}) => {
  const router = useRouter();
  const linkRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    hideJoin(false);
  }

  return (
    <>
      <Modal
        withCloseButton={false}
        opened={openJoin}
        onClose={handleClose}
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
          <Box pos={"absolute"} right={10} top={-4} onClick={handleClose}>
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
            Join meeting
          </Title>
        </Box>
        <Stack gap={16}>
          <TextInput
            label="Enter meeting link"
            size="lg"
            classNames={{
              label: classes.textarea_label,
              input: classes.textarea_input,
              error: classes.error_label,
            }}
            ref={linkRef}
          />
          <Button
            onClick={() => router.push(linkRef?.current?.value as string)}
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
          >
            join meeting
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default JoinMeeting;
