import { notifications } from "@mantine/notifications";

export function customNotification(message: string) {
  return notifications.show({
    message,
    color: "#1C1F2E",
    autoClose: 3000,
    styles: (theme) => ({
      root: {
        fontSize: 24,
        fontFamily: "Nunito_sans_medium",
      },
    }),
  });
}
