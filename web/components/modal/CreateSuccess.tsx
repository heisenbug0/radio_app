import { Modal, Button, Stack, Group, Title, CopyButton } from "@mantine/core";
import classes from "./modal.module.css";
import SuccessIcon from "../icons/Success";
import { CopyIcon } from "../icons/Copy";
import { Call } from "@stream-io/video-react-sdk";

const CreateSuccess = ({
  opened,
  close,
  meetingData,
}: {
  opened: boolean;
  close: () => void;
  meetingData: Call | undefined;
}) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        transitionProps={{
          transition: "slide-right",
          duration: 600,
          timingFunction: "linear",
        }}
        classNames={{
          content: classes.modal_body,
        }}
        centered
      >
        <Stack>
          <Group justify="center">
            <SuccessIcon />
          </Group>
          <Title
            order={1}
            ff="Nunito_sans_bold"
            fw={700}
            fz={30}
            c="light_colors.0"
            ta="center"
            tt="capitalize"
          >
            meeting created
          </Title>
          <CopyButton
            value={`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingData?.id}`}
          >
            {({ copied, copy }) => (
              <Button
                leftSection={<CopyIcon />}
                h={40}
                fullWidth
                variant="white"
                radius={4}
                bg="other_colors.2"
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
          <Button
            type="button"
            onClick={close}
            h={40}
            fullWidth
            variant="white"
            radius={4}
            bg="dark_colors.3"
            color="light_colors.0"
            fw={500}
            ff="Nunito_sans_medium"
            tt="capitalize"
            fz={16}
          >
            close
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default CreateSuccess;
