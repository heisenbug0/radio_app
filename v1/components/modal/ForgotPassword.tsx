import {
  checkUserEmailExist,
  firebaseSendPasswordResetEmail,
} from "@/services/auth";
import customNotifications from "@/services/notification";
import { errorFunc } from "@/services/utils";
import { Modal, Button, Divider, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { FormEvent, useState } from "react";

export default function ForgotPassword({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<{ email: string }>({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email address"),
    },
  });

  async function handleSendEmail({
    values,
    e,
  }: {
    values: { email: string };
    e: FormEvent;
  }) {
    e.preventDefault();
    setLoader(true);
    const { email } = values;
    try {
      const res = await checkUserEmailExist({ email });
      if (res?.error) {
        await firebaseSendPasswordResetEmail({ email });
        customNotifications.successNotify({
          message: "Password reset email was sent",
        });
        close();
      } else customNotifications.cautionNotify({ message: res.message });
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }
  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
        centered
      >
        <Modal.Overlay />
        <Modal.Content data-autofocus>
          <Modal.Header>
            <Modal.Title className="font-manrope-bold text-2xl capitalize">
              forgot password
            </Modal.Title>
            <Modal.CloseButton size={28} />
          </Modal.Header>
          <Divider />
          <Modal.Body>
            <form
              onSubmit={form.onSubmit((values, e) =>
                handleSendEmail({ values, e })
              )}
            >
              <div className="w-full my-4">
                <TextInput
                  label="email"
                  description="Enter registered email"
                  size="md"
                  placeholder="Enter registered email"
                  withAsterisk
                  styles={(theme) => ({
                    label: {
                      paddingBottom: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: "manrope-bold",
                      textTransform: "capitalize",
                    },
                    input: {
                      borderColor: theme.colors.gray[4],
                      borderWidth: 1,
                      fontFamily: "manrope-light",
                      fontSize: 13,
                      "&:focus": {
                        borderColor: theme.colors.gray[4],
                      },
                    },
                  })}
                  className="w-full"
                  {...form.getInputProps("email")}
                />
              </div>
              <Button
                loading={loader}
                loaderPosition="right"
                color="gray.0"
                h={42}
                type="submit"
                fullWidth
                variant="subtle"
                className="bg-primary-700 hover:bg-primary-700 font-normal text-base capitalize text-white rounded-full"
              >
                send
              </Button>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
