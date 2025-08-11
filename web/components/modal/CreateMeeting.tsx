import { Modal, Button, Textarea, Stack } from "@mantine/core";
import classes from "./modal.module.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import CreateSuccess from "./CreateSuccess";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CustomIconsProps } from "@/custom-type";
import { ScheduleMeetingProps } from "@/custom-type";

const ScheduleMeeting = ({
  show,
  hide,
}: {
  show: boolean;
  hide: () => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [callDetails, setCallDetails] = useState<Call>();
  const [loader, setLoader] = useState<boolean>();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const form = useForm<ScheduleMeetingProps>({
    initialValues: {
      date: new Date(),
      description: "",
    },

    validate: {
      date: isNotEmpty("Provide date & time of meeting"),
      description: isNotEmpty("Provide the description"),
    },
  });

  function handleClose() {
    hide();
    form.reset();
  }

  function handleOpenSuccess() {
    form.reset();
    hide();
    open();
  }

  const scheduleMeeting = async ({
    values,
    e,
  }: {
    values: ScheduleMeetingProps;
    e: any;
  }) => {
    e.preventDefault();
    setLoader(true);
    if (!client || !user) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Call failed to start!");

      const starts_at = values.date.toISOString();
      const description = values.description;

      await call.getOrCreate({
        data: {
          starts_at,
          custom: {
            color: "green",
            description,
          },
        },
      });
      setCallDetails(call);
      handleOpenSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <Modal
        opened={show}
        onClose={handleClose}
        title="Schedule meeting"
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
        classNames={{
          header: classes.modal_header,
          content: classes.modal_body,
          title: classes.modal_title,
          close: classes.modal_close,
        }}
        centered
      >
        <form
          onSubmit={form.onSubmit((values, e) =>
            scheduleMeeting({ values, e })
          )}
        >
          <Stack gap={16}>
            <DateTimePicker
              size="md"
              valueFormat="DD MMM YYYY hh:mm A"
              label="Select date & time"
              placeholder="Pick date and time"
              classNames={{
                label: classes.textarea_label,
                input: classes.textarea_input,
                timeInput: classes.textarea_input,
                calendarHeader: classes.textarea_label,
                day: classes.day_label,
                section: classes.date_body,
                submitButton: classes.date_submit_button,
                error: classes.error_label,
              }}
              dropdownType="modal"
              {...form.getInputProps("date")}
            />
            <Textarea
              label="Add a description"
              minRows={3}
              size="lg"
              classNames={{
                label: classes.textarea_label,
                input: classes.textarea_input,
                error: classes.error_label,
              }}
              {...form.getInputProps("description")}
            />
            <Button
              type="submit"
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
              create meeting
            </Button>
          </Stack>
        </form>
      </Modal>
      <CreateSuccess opened={opened} close={close} meetingData={callDetails} />
    </>
  );
};

export default ScheduleMeeting;
