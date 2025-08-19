import {
  Box,
  Group,
  FileButton,
  Button,
  Stack,
  Text,
  Paper,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import LocationAutoCompleteSearch from "../LocationAutoCompleteSearch";
import Image from "next/image";
import { userImageLoader } from "@/services/utils";
import GeneralTextAreaDisabled from "@/components/inputs/GeneralTextAreaDisabled";
import GeneralTextInput from "../tab/GeneralTextInput";

export default function PersonalInfo({
  form,
  user,
}: {
  form: UseFormReturnType<ProfileProps>;
  user: UserProps;
}) {
  const [url, setUrl] = useState<string>("");

  function handleUpload(image: File | null) {
    const url = URL.createObjectURL(image as File);
    setUrl(url);
    form.setFieldValue("profileImage", image);
  }
  useEffect(() => {
    if (user?.profile) setUrl(user?.profile);
  }, [user]);

  return (
    <Box className="p-5">
      <Group spacing={16} mb={30}>
        <Paper
          withBorder
          w={128}
          h={128}
          className="rounded-full relative flex justify-center items-center overflow-hidden text-sm"
        >
          {url ? (
            <Image
              src={url}
              alt={`${user?.name} image`}
              loader={userImageLoader}
              fill
              loading="lazy"
              sizes="(min-width: 808px) 50vw, 100vw"
              className="rounded-full"
            />
          ) : (
            <Image
              src="/avatar.png"
              alt="User avatar"
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              className="rounded-full"
              priority
            />
          )}
        </Paper>

        <Box>
          <FileButton
            onChange={(e) => handleUpload(e)}
            accept="image/png,image/jpeg"
          >
            {(props) => (
              <Button className="bg-black hover:bg-black rounded-lg" {...props}>
                Upload image
              </Button>
            )}
          </FileButton>
          <Text className="text-sm text-red-500 font-manrope-regular mt-2">
            Note: Photos must be JPEG or PNG format and at least 120x120
          </Text>
        </Box>
      </Group>
      <Stack className="mt-3">
        <Box className="w-full space-y-2 md:space-y-0 md:flex md:space-x-2 ">
          <GeneralTextInput
            label="name"
            placeholder=""
            form={form}
            formTarget="name"
          />
          <GeneralTextInput
            label="email"
            placeholder=""
            form={form}
            formTarget="email"
          />
        </Box>
        <Box className="w-full space-y-2 md:space-y-0 md:flex md:space-x-2 ">
          <GeneralTextInput
            label="phone number"
            placeholder=""
            form={form}
            formTarget="phoneNumber"
          />
          <LocationAutoCompleteSearch form={form} />
        </Box>
        <GeneralTextAreaDisabled form={form} />
      </Stack>
    </Box>
  );
}
