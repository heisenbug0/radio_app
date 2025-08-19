import { notifications } from "@mantine/notifications";

function successNotify({ message }: { message: string }) {
  return notifications.show({
    title: "Success",
    message,
    icon: "✅",
    autoClose: 3000,
    withBorder: true,
    color: "gray.0",
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.gray[0],
      },
      title: { color: theme.colors.black, fontSize: 16 },
      description: { fontSize: 16 },
    }),
  });
}

function failedNotify({ message }: { message: string }) {
  return notifications.show({
    title: "Error",
    message,
    icon: "❌",
    color: "gray.0",
    autoClose: 3000,
    withBorder: true,
    styles: (theme) => ({
      title: { color: theme.colors.black, fontSize: 16 },
      description: { fontSize: 16 },
      root: {
        backgroundColor: theme.colors.gray[0],
      },
    }),
  });
}

function cautionNotify({ message }: { message: string }) {
  return notifications.show({
    title: "Warning",
    message,
    autoClose: 3000,
    withBorder: true,
    icon: "⚠️",
    color: "gray.0",
    styles: (theme) => ({
      root: {
        backgroundColor: theme.colors.gray[0],
      },
      title: { color: theme.colors.black, fontSize: 16 },
      description: { fontSize: 16 },
    }),
  });
}

const customNotifications = {
  successNotify,
  cautionNotify,
  failedNotify,
};
export default customNotifications;
