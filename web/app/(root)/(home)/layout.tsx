"use client";

import NavLinkItems from "@/components/home/NavLinkItems";
import Logo from "@/components/logo/Logo";
import { SignedIn, UserButton } from "@clerk/nextjs";
import {
  AppShell,
  Box,
  Burger,
  CloseButton,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Afrimeet",
  description: "inmotion hub video calling app",
  icons: {
    icon: "/logo.svg",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      layout="alt"
      header={{ height: { base: 60, md: 72 } }}
      navbar={{
        width: { base: 264 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header bg="dark_colors.0" withBorder={false}>
        <Group h="100%" px="md" justify="space-between">
          <Box hiddenFrom="md">
            <Logo />
          </Box>
          <Box visibleFrom="md" w={36} h={36} />

          <Group>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/sign-in"
                afterMultiSessionSingleSignOutUrl="/sign-in"
              />
            </SignedIn>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="md"
              color="light_colors.1"
            />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar withBorder={false} p="md" bg="dark_colors.0">
        <AppShell.Section pos={"relative"}>
          <Group gap={1}>
            <Logo />
            <Text
              tt={"capitalize"}
              fz={26}
              fw={800}
              c="gray.0"
              ff="Nunito_sans_extrabold"
            >
              afrimeet
            </Text>
          </Group>
          <CloseButton
            onClick={toggle}
            hiddenFrom="sm"
            size="lg"
            pos="absolute"
            top={-4}
            right={0}
          />
        </AppShell.Section>
        <AppShell.Section grow my="xl" component={ScrollArea}>
          <NavLinkItems toggleDrawer={toggle} />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
