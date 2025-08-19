import PersonalInfo from "@/components/dashboard/profile/PersonalInfo";
import SocailMedia from "@/components/dashboard/profile/SocialMedia";
import UserDashboardLayout from "@/components/layout/UserDashboardLayout";
import useUser from "@/hooks/useUser";
import customNotifications from "@/services/notification";
import { updateUser } from "@/services/requests";
import { errorFunc } from "@/services/utils";
import {
  Box,
  Divider,
  Paper,
  Title,
  Stack,
  Textarea,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent, useEffect, useState } from "react";
import { mutate } from "swr";

export default function Profile() {
  const { user, loading, error } = useUser();
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<ProfileProps>({
    initialValues: {
      profileImage: null,
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      aboutMe: "",
      facebook: "",
      instagram: "",
      pinterest: "",
      twitter: "",
      latitude: "",
      longitude: "",
      notification: "",
      firebase_id: "",
      fcm_id: "",
    },
  });

  async function handleProfileUpload({
    values,
    e,
  }: {
    values: ProfileProps;
    e: FormEvent;
  }) {
    e.preventDefault();
    setLoader(true);
    const data = new FormData();
    try {
      data.append("profile", values.profileImage as File);
      data.append("name", values.name);
      data.append("email", values.email);
      data.append("mobile", values.phoneNumber);
      data.append("fcm_id", values.fcm_id);
      data.append("address", values.address);
      data.append("firebase_id", values.firebase_id);
      data.append("about_me", values.aboutMe);
      data.append("notification", values.notification);
      data.append("facebook_id", values.facebook);
      data.append("twitter_id", values.twitter);
      data.append("instagram_id", values.instagram);
      data.append("pinterest_id", values.pinterest);
      data.append("latitude", values.latitude);
      data.append("longitude", values.longitude);

      const response = await updateUser({ data });
      if (!response?.error) {
        customNotifications.successNotify({ message: response.message });
        mutate("get_user_by_id");
      }
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    if (user?.name) {
      form.setValues({
        name: user.name,
        email: user.email,
        phoneNumber: user.mobile,
        address: user.address,
        aboutMe: user.about_me,
        facebook: user.facebook_id,
        instagram: user.instagram_id,
        pinterest: user.pintrest_id,
        twitter: user.twiiter_id,
        latitude: user.latitude,
        longitude: user.longitude,
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <UserDashboardLayout>
      <Box className="h-full">
        <Title className="text-2xl capitalize text-black font-manrope-semibold">
          my profile
        </Title>
        <form
          onSubmit={form.onSubmit((values, e) =>
            handleProfileUpload({ values, e })
          )}
        >
          <Stack>
            <Box
              className="w-full space-y-4 lg:space-y-0 lg:flex lg:space-x-4"
              mt={20}
            >
              <Paper withBorder radius={7} className="bg-white w-full ">
                <Box>
                  <Title className="text-2xl capitalize font-manrope-semibold p-5 ">
                    personal information
                  </Title>
                </Box>
                <Divider />
                <PersonalInfo form={form} user={user} />
              </Paper>
              <Paper withBorder radius={7} className="bg-white w-full">
                <Box>
                  <Title className="text-2xl capitalize font-manrope-semibold p-5 ">
                    about me
                  </Title>
                </Box>
                <Divider />
                <Box className="p-5">
                  <Textarea
                    label="about me"
                    placeholder="Tell us about yourself!..."
                    minRows={8}
                    styles={(theme) => ({
                      label: {
                        fontSize: 14,
                        textTransform: "capitalize",
                        fontFamily: "manrope-bold",
                        fontWeight: 700,
                      },
                      input: {
                        borderColor: theme.colors.gray[2],
                        borderWidth: 1,
                        fontFamily: "manrope-medium",
                        fontWeight: 500,
                        "&:focus": {
                          borderColor: theme.colors.gray[4],
                        },
                      },
                    })}
                    className="w-full"
                    {...form.getInputProps("aboutMe")}
                  />
                </Box>
              </Paper>
            </Box>
            <Paper withBorder radius={7} className="bg-white w-full ">
              <Box>
                <Title className="text-2xl capitalize font-manrope-semibold p-5 ">
                  social media
                </Title>
              </Box>
              <Divider />
              <SocailMedia form={form} />
            </Paper>
            <Group position="right">
              <Button
                loading={loader}
                loaderPosition="right"
                color="gray.0"
                type="submit"
                h={56}
                className="bg-primary-700 hover:bg-primary-700 capitalize text- base text-white rounded-md font-manrope-medium font-medium"
              >
                update profile
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </UserDashboardLayout>
  );
}
Profile.requireAuth = true;
