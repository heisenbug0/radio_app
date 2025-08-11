import { SignUp } from "@clerk/nextjs";
import { Stack } from "@mantine/core";

export default function Signup() {
  return (
    <Stack
      justify="center"
      align="center"
      mih={"100dvh"}
      py={20}
      bg="dark_colors.1"
    >
      <SignUp />
    </Stack>
  );
}
