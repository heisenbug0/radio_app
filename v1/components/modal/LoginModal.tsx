import { signInExistingUser } from "@/services/auth";
import customNotifications from "@/services/notification";
import { processRegister as processLogin } from "@/services/utils";
import {
  Modal,
  Button,
  Divider,
  Box,
  Text,
  TextInput,
  Stack,
  PasswordInput,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import Link from "next/link";
import { FormEvent, useState } from "react";
import ForgotPassword from "./ForgotPassword";

export default function LoginModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const [loader, setLoader] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean>(false); // forgotPass modal
  const form = useForm<RegFormProps>({
    initialValues: {
      email: "",
      password: "",
      name: "",
      mobile: "",
      address: "",
      latitude: "",
      longitude: "",
    },
    validate: {
      email: isEmail("Invalid email address"),
      password: isNotEmpty("Password is compulsory"),
    },
  });

  async function handleLogin({
    values,
    e,
  }: {
    values: RegFormProps;
    e: FormEvent;
  }) {
    e.preventDefault();
    setLoader(true);
    const { email, password } = values;
    try {
      const firebaseReg: FirebaseAccessProps = {
        email,
        password,
      };
      const authResponse = await signInExistingUser({ firebaseReg });
      if (authResponse?.uid) {
        const res = await processLogin({
          firebaseId: authResponse.uid,
          values,
          setLoader,
          form,
        });
        if (!res?.error) close();
      }
    } catch (error: any) {
      const errorCode = error?.code;
      const errorMessage = error?.message;
      console.error("error ===>", error);
      if (errorMessage === "Firebase: Error (auth/invalid-credential).")
        customNotifications.failedNotify({
          message: "Invalid credentials.",
        });
      else if (errorCode == "auth/invalid-email")
        customNotifications.failedNotify({ message: errorMessage });
    } finally {
      setLoader(false);
    }
  }

  const handleOpenForgot = () => setMount(true);
  const handleCloseForgot = () => setMount(false);
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
              Login
            </Modal.Title>
            <Modal.CloseButton size={28} />
          </Modal.Header>
          <Divider />
          <Modal.Body>
            <form
              onSubmit={form.onSubmit((values, e) =>
                handleLogin({ values, e })
              )}
            >
              <Box className="">
                <Stack spacing={6} className="w-full my-4">
                  <TextInput
                    label="email"
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
                        borderColor: theme.colors.gray[2],
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
                  <Box>
                    <PasswordInput
                      label="password"
                      size="md"
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
                          borderColor: theme.colors.gray[2],
                          borderWidth: 1,
                          fontFamily: "manrope-light",
                          fontSize: 13,
                          "&:focus-within": {
                            borderColor: theme.colors.gray[4],
                          },
                        },
                      })}
                      className="w-full"
                      {...form.getInputProps("password")}
                    />
                    <ActionIcon
                      mt={4}
                      onClick={handleOpenForgot}
                      variant="transparent"
                      className="w-fit capitalize text-black hover:text-primary-700 text-xs"
                    >
                      forgot password?
                    </ActionIcon>
                  </Box>
                </Stack>
                <Button
                  loading={loader}
                  loaderPosition="right"
                  color="gray.0"
                  size="md"
                  type="submit"
                  fullWidth
                  variant="subtle"
                  className="bg-primary-700 hover:bg-primary-700 font-normal text-base capitalize text-white rounded-full"
                >
                  continue
                </Button>

                <Flex gap={7} mt={20} align="center" justify="center">
                  <Text className="text-sm font-manrope-regular">
                    Don&apos;t have an account?
                  </Text>
                  <Text
                    component={Link}
                    href="/register"
                    className="text-base font-manrope-regular capitalize text-primary-700"
                    span
                  >
                    register
                  </Text>
                </Flex>
              </Box>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {mount && <ForgotPassword opened={mount} close={handleCloseForgot} />}
    </>
  );
}
