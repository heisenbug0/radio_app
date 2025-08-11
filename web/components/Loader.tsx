import { Box, Loader } from "@mantine/core";

export default function InitialLoader() {
  return (
    <Box className="h-[calc(100vh-200px)] w-full flex items-center justify-center">
      <Loader variant="bar" size="lg" color="light_colors.1" />
    </Box>
  );
}
