import {
  Box,
  Button,
  Divider,
  TextInput,
  Text,
  Textarea,
  Select,
  Stack,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormEvent, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import useUser from "@/hooks/useUser";
import useProperties from "@/hooks/useProperties";
import { errorFunc } from "@/services/utils";
import { postFunc } from "@/services/requests";
import customNotifications from "@/services/notification";
import { mutate } from "swr";

export default function AddReelForm() {
  const [loader, setLoader] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<UploadResult | null>();
  const { user } = useUser();
  const { properties } = useProperties({
    src: `get_property?userid=${user?.id}`,
  });

  const form = useForm<ReelProps>({
    initialValues: {
      title: "",
      property_id: "",
      description: "",
      video_link: "",
      public_id: "",
      user_id: user?.id,
      is_admin: false,
    },
    validate: {},
  });

  const propertySelect = useMemo(() => {
    return (
      properties?.map((property: PropertyProps) => ({
        value: property.id.toString(),
        label: property.title,
      })) ?? []
    );
  }, [properties]);

  async function handleUploadReel({
    v,
    e,
  }: {
    v: ReelProps;
    e: FormEvent | undefined;
  }) {
    e?.preventDefault();
    setLoader(true);
    v.video_link = successInfo?.secure_url as string;
    v.public_id = successInfo?.public_id as string;

    try {
      const res = await postFunc<ReelProps>({ data: v, url: "add/reels" });
      if (!res?.error) {
        customNotifications.successNotify({
          message: "Reel successfully uploaded.",
        });
        mutate(`list/reels?userid=${user?.id}`);
        form.reset();
        setSuccessInfo(null);
      } else {
        customNotifications.cautionNotify({
          message: "Reel failed to upload!",
        });
      }
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }
  return (
    <form onSubmit={form.onSubmit((v, e) => handleUploadReel({ v, e }))}>
      <Stack spacing={15} mt={30}>
        <Flex gap={15}>
          <TextInput
            label="Reel title"
            size="md"
            placeholder="Enter title"
            styles={(theme) => ({
              label: {
                paddingBottom: 4,
                fontSize: 14,
                fontWeight: 400,
                fontFamily: "manrope-regular",
              },
              input: {
                borderColor: theme.colors.gray[2],
                borderWidth: 1,
                fontSize: 13,
                fontFamily: "manrope-regular",
                "&:focus": {
                  borderColor: theme.colors.gray[4],
                },
              },
            })}
            className="w-full"
            {...form.getInputProps("title")}
          />
          <Select
            label="Property linked to"
            size="md"
            placeholder="Select property"
            searchable
            nothingFound="No options"
            maxDropdownHeight={280}
            data={propertySelect}
            styles={(theme) => ({
              label: {
                paddingBottom: 4,
                fontSize: 14,
                fontWeight: 400,
                fontFamily: "manrope-regular",
              },
              input: {
                borderColor: theme.colors.gray[2],
                borderWidth: 1,
                fontSize: 13,
                fontFamily: "manrope-regular",
                "&:focus": {
                  borderColor: theme.colors.gray[4],
                },
              },
              item: {
                fontSize: 13,

                "&[data-selected]": {
                  "&, &:hover": {
                    backgroundColor: "black",
                  },
                },
              },
            })}
            className="w-full"
            {...form.getInputProps("property_id")}
          />
        </Flex>
        <Textarea
          label="Description"
          size="md"
          autosize
          minRows={4}
          description="Max of 500 characters"
          placeholder="Enter a brief description about the reel"
          styles={(theme) => ({
            label: {
              paddingBottom: 4,
              fontSize: 14,
              fontWeight: 400,
              fontFamily: "manrope-regular",
            },
            input: {
              borderColor: theme.colors.gray[2],
              borderWidth: 1,
              fontSize: 13,
              fontFamily: "manrope-regular",
              "&:focus": {
                borderColor: theme.colors.gray[4],
              },
            },
          })}
          className="w-full"
          {...form.getInputProps("description")}
        />
        <Box>
          <CldUploadWidget
            options={{ resourceType: "video", sources: ["local"] }}
            signatureEndpoint="/api/signed-upload"
            onSuccess={(results) => {
              if (results?.info) {
                setSuccessInfo(results.info as unknown as UploadResult);
              }
            }}
          >
            {({ open }) => {
              return (
                <Button
                  size="md"
                  bg="dark.9"
                  variant="white"
                  radius={5}
                  c="white"
                  fw={500}
                  className="font-manrope-medium"
                  onClick={() => open()}
                >
                  Upload video
                </Button>
              );
            }}
          </CldUploadWidget>
          {successInfo?.original_filename && (
            <Text className="capitalize font-manrope-medium text-base mt-2">
              name: {successInfo?.original_filename}
            </Text>
          )}
        </Box>
        <Divider />
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
      </Stack>
    </form>
  );
}
