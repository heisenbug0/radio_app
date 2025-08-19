import LocationAutoCompleteSearch from "@/components/dashboard/LocationAutoCompleteSearch";
import GeneralTextAreaDisabled from "@/components/inputs/GeneralTextAreaDisabled";
import { signupNewUser } from "@/services/auth";
import { errorFunc, processRegister } from "@/services/utils";
import {
  Box,
  Title,
  Paper,
  Text,
  Divider,
  Button,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Register() {
  const router = useRouter();
  // const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<RegFormProps>({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      // address: "",
      password: "",
      latitude: "",
      longitude: "",
    },
    validate: {
      name: isNotEmpty("Fullname is compulsory"),
      email: isEmail("Invalid email"),
      mobile: isNotEmpty("Phone number is compulsory"),
      // address: isNotEmpty("Address is compulsory"),
      password: isNotEmpty("Password is compulsory"),
    },
  });

  // function handleUpload(image: File | null) {
  //   const url = URL.createObjectURL(image as File);
  //   setPreviewUrl(url);
  //   form.setFieldValue("profile", image);
  // }

  async function handleRegister({
    values,
    event,
  }: {
    values: RegFormProps;
    event: FormEvent;
  }) {
    event.preventDefault();
    const { email, password } = values;
    setLoader(true);
    try {
      const firebaseReg: FirebaseAccessProps = {
        email,
        password,
      };
      const authResponse = await signupNewUser({ firebaseReg });
      if (authResponse?.uid) {
        processRegister({
          firebaseId: authResponse.uid,
          values,
          setLoader,
          form,
        });
      }
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }

  return (
    <main className="w-full">
      <Box className="w-full ">
        <Box className="w-full h-[390px] flex items-center justify-center bgOverlay relative">
          <Title
            order={1}
            className="text-white font-manrope-semibold capitalize"
          >
            basic information
          </Title>
          <Button
            onClick={() => router.back()}
            className="w-fit bg-black rounded-md h-8 px-2 absolute top-10 left-10 text-white font-manrope-regular font-medium text-base "
            variant="transparent"
            leftIcon={<IconChevronLeft size={24} className="text-white" />}
          >
            Go Back
          </Button>
        </Box>
        <Box py={50} px={16}>
          <form
            onSubmit={form.onSubmit((values, event) =>
              handleRegister({ values, event })
            )}
          >
            <Paper
              withBorder
              className="w-full max-w-[695px] rounded-md mx-auto"
            >
              <Box>
                <Text className="text-black font-manrope-semibold capitalize p-3">
                  add information
                </Text>
                <Divider />
              </Box>
              <Box p={20}>
                {/* <Group spacing={16} mb={30}>
                  <Paper withBorder className="rounded-full">
                    <Avatar
                      size={128}
                      color="dark.3"
                      className="rounded-full"
                      src={previewUrl}
                    />
                  </Paper>
                  <Box>
                    <FileButton
                      onChange={(e) => handleUpload(e)}
                      accept="image/png,image/jpeg"
                    >
                      {(props) => (
                        <Button
                          className="bg-black hover:bg-black rounded-lg"
                          {...props}
                        >
                          Upload image
                        </Button>
                      )}
                    </FileButton>
                    <Text className="text-sm text-red-700 font-manrope-regular mt-2">
                      Note: Photos must be JPEG or PNG format and at least 120 x
                      120
                    </Text>
                  </Box>
                </Group> */}
                <Box className="w-full space-y-4 md:flex md:space-y-0 md:space-x-4">
                  <TextInput
                    label="Full Name"
                    size="md"
                    placeholder="Enter name"
                    withAsterisk
                    styles={(theme) => ({
                      label: {
                        paddingBottom: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "manrope-bold",
                      },
                      input: {
                        borderColor: theme.colors.gray[2],
                        borderWidth: 1,
                        fontFamily: "manrope-medium",
                        "&:focus": {
                          borderColor: theme.colors.gray[4],
                        },
                      },
                    })}
                    className="w-full"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Email"
                    size="md"
                    placeholder="Enter preferred email"
                    withAsterisk
                    styles={(theme) => ({
                      label: {
                        paddingBottom: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "manrope-bold",
                      },
                      input: {
                        borderColor: theme.colors.gray[2],
                        borderWidth: 1,
                        fontFamily: "manrope-medium",
                        "&:focus": {
                          borderColor: theme.colors.gray[4],
                        },
                      },
                    })}
                    className="w-full"
                    {...form.getInputProps("email")}
                  />
                </Box>
                <Box
                  my={16}
                  className="w-full space-y-4 md:flex md:space-y-0 md:space-x-4"
                >
                  <TextInput
                    label="Phone Number"
                    size="md"
                    placeholder="Enter phone number"
                    withAsterisk
                    styles={(theme) => ({
                      label: {
                        paddingBottom: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "manrope-bold",
                      },
                      input: {
                        borderColor: theme.colors.gray[2],
                        borderWidth: 1,
                        fontFamily: "manrope-medium",
                        "&:focus": {
                          borderColor: theme.colors.gray[4],
                        },
                      },
                    })}
                    className="w-full"
                    {...form.getInputProps("mobile")}
                  />
                  <PasswordInput
                    label="Password"
                    size="md"
                    withAsterisk
                    styles={(theme) => ({
                      label: {
                        paddingBottom: 4,
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "manrope-bold",
                      },
                      input: {
                        borderColor: theme.colors.gray[2],
                        borderWidth: 1,
                        fontFamily: "manrope-medium",
                        "&:focus-within": {
                          borderColor: theme.colors.gray[4],
                        },
                      },
                    })}
                    className="w-full"
                    {...form.getInputProps("password")}
                  />
                </Box>
                <Box>
                  {/* <LocationAutoCompleteSearch form={form} />
                  <GeneralTextAreaDisabled form={form} /> */}
                </Box>
              </Box>
              <Divider />
              <Box mt={10} className="text-center ">
                <Text className="text-sm font-manrope-regular" span>
                  By clicking continue you agree to our
                </Text>
                <Text
                  component={Link}
                  href="#"
                  className="text-sm font-manrope-regular capitalize text-green-600 ml-2"
                  span
                >
                  terms & conditions
                </Text>
                <Text className="text-sm font-manrope-regular mx-2" span>
                  and
                </Text>
                <Text
                  component={Link}
                  href="#"
                  className="text-sm font-manrope-regular capitalize text-green-600"
                  span
                >
                  Privacy Policy
                </Text>
              </Box>
              <Box p={20} className="flex justify-end items-center">
                <Button
                  loading={loader}
                  loaderPosition="right"
                  color="gray.0"
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-700 text-white capitalize font-manrope-regular font-medium rounded-lg h-10 w-32"
                >
                  submit
                </Button>
              </Box>
            </Paper>
          </form>
        </Box>
      </Box>
    </main>
  );
}
