import { usePackageDetails } from "@/hooks/useAdverts";
import useUser from "@/hooks/useUser";
import customNotifications from "@/services/notification";
import { createAdvert } from "@/services/requests";
import { errorFunc } from "@/services/utils";
import { Modal, Button, Divider, TextInput, Select } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { FormEvent, useEffect, useState } from "react";
import { mutate } from "swr";

export default function AddAdvert({
  opened,
  close,
  advert,
}: {
  opened: boolean;
  close: () => void;
  advert: number;
}) {
  const { user } = useUser();
  const { packageDetails } = usePackageDetails({
    src: `get_package?user_id=${user?.id}`,
  });
  const [loader, setLoader] = useState<boolean>(false);
  const form = useForm<CreateAdsProps>({
    initialValues: {
      type: "",
      property_id: advert,
      package_id: 0,
    },
    validate: {
      type: isNotEmpty("Type can't be empty"),
      property_id: isNotEmpty("Property ID can't be empty"),
      package_id: isNotEmpty("Package ID can't be empty"),
    },
  });

  async function handlePromote({
    values,
    e,
  }: {
    values: CreateAdsProps;
    e: FormEvent;
  }) {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await createAdvert({ data: values });
      if (!res?.error) {
        customNotifications.successNotify({
          message: res.message,
        });
        mutate(`get_property?userid=${user?.id}`);
        mutate("get_advertisement");
        form.reset();
        close();
      } else customNotifications.cautionNotify({ message: res.message });
    } catch (error) {
      errorFunc(error);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    if (packageDetails?.id) {
      form.setValues({
        type: "",
        property_id: advert,
        package_id: packageDetails.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advert, packageDetails]);
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
              promote product
            </Modal.Title>
            <Modal.CloseButton size={28} />
          </Modal.Header>
          <Divider />
          <Modal.Body>
            <form
              onSubmit={form.onSubmit((values, e) =>
                handlePromote({ values, e })
              )}
            >
              <div className="w-full my-4">
                <Select
                  label="type"
                  data={["Slider", "HomeScreen", "ProductListing"]}
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
                    item: {
                      // applies styles to selected item
                      padding: 5,
                      "&[data-selected]": {
                        "&, &:hover": {
                          backgroundColor: "black",
                        },
                      },
                    },
                  })}
                  className="w-full"
                  {...form.getInputProps("type")}
                />
                <TextInput
                  disabled
                  my={10}
                  label="Property ID"
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
                  {...form.getInputProps("property_id")}
                />
                <TextInput
                  disabled
                  my={10}
                  label="Package ID"
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
                  {...form.getInputProps("package_id")}
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
                className="bg-black hover:bg-black font-normal text-base capitalize text-white rounded-full"
              >
                promote
              </Button>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
