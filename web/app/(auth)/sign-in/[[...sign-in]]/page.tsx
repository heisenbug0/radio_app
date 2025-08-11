import { SignIn } from "@clerk/nextjs";
import { Stack } from "@mantine/core";

export default function Signin() {
  return (
    <Stack justify="center" align="center" mih={"100dvh"} bg="dark_colors.1">
      <SignIn />
    </Stack>
  );
}
