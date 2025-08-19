import { firebaseLogout, logoutUser } from "@/services/auth";
import customNotifications from "@/services/notification";
import { errorFunc } from "@/services/utils";
import { Modal, Button, Title, Box, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LogoutConfirm({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const [loader, setLoader] = useState<boolean>(false);

  async function signout() {
    setLoader(true);
    try {
      firebaseLogout();
      const response = await logoutUser();
      if (!response?.error) {
        customNotifications.successNotify({ message: response.message });
        Cookies.remove("access_token");
        close();
        setTimeout(() => window.location.replace("/"), 2500);
      } else customNotifications.cautionNotify({ message: response.message });
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
          transition: "slide-down",
          duration: 600,
          timingFunction: "linear",
        }}
        centered
      >
        <Modal.Overlay />
        <Modal.Content data-autofocus>
          <Modal.Body>
            <Box className="w-full flex justify-center items-center">
              <IconAlertCircle className="text-yellow-600" size={100} />
            </Box>
            <Box className="h-full">
              <Title className="text-2xl normal-case font-manrope-semibold text-black text-center">
                Are you sure?
              </Title>
              <Text
                mt={10}
                className="text-base normal-case font-manrope-regular text-black text-center"
              >
                You won&apos;t be able to revert this.
              </Text>

              <Box mt={40} className="flex space-x-4">
                <Button
                  loading={loader}
                  loaderPosition="left"
                  color="gray.0"
                  onClick={signout}
                  fullWidth
                  variant="subtle"
                  className="bg-primary-700 hover:bg-primary-700 font-normal text-white capitalize"
                >
                  Yes! Logout
                </Button>
                <Button
                  onClick={close}
                  fullWidth
                  variant="subtle"
                  className="bg-black hover:bg-black capitalize text-white font-normal "
                >
                  cancel
                </Button>
              </Box>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
