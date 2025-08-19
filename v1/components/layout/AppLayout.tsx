import AppFooter from "@/components/global/footer/AppFooter";
import HomeBanner from "@/components/global/HomeBanner";
import { Box, Container, Stack } from "@mantine/core";

export default function AppLayout({ children }: { children: JSX.Element }) {
  return (
    <main className="w-full">
      <Stack spacing={0} mih="100dvh">
        <HomeBanner />
        <Box
          sx={() => ({
            flex: 1,
          })}
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
