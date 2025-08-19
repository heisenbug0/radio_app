import AppFooter from "@/components/global/footer/AppFooter";
import { Box, Container, Stack } from "@mantine/core";
import PropertiesBanner from "../global/PropertiesBanner";

export default function AllPropertyLayout({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <main className="w-full">
      <Stack mih="100dvh" spacing={0}>
        <PropertiesBanner />
        <Box
          sx={(theme) => ({
            flex: 1,
          })}
          className="bg-appBg-600 "
        >
          <Container size={1650} px={0}>
            {children}
          </Container>
        </Box>
      </Stack>

      <AppFooter />
    </main>
  );
}
