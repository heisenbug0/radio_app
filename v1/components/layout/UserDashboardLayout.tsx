import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  Burger,
  useMantineTheme,
  Box,
  ActionIcon,
  Group,
  ThemeIcon,
  Container,
  Button,
  Paper,
} from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import { dashboardItems } from "@/data/dashboardItems";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import LogoutConfirm from "../modal/LogoutConfirm";

export default function UserDashboardLayout({
  children,
}: {
  children: JSX.Element;
}) {
  const theme = useMantineTheme();
  const [opened] = useState(true);
  const [swap, setSwap] = useState(false);
  const router = useRouter();
  const [mountLogout, setMountLogout] = useState<boolean>(false); // logout modal
  const handleClose = () => setMountLogout(false);

  return (
    <>
      <AppShell
        px={0}
        className="bg-appBg-600"
        layout={!swap ? "default" : "alt"}
        navbar={
          <Navbar hidden={!opened} width={!swap ? { base: 63 } : { base: 238 }}>
            <Navbar.Section>
              <Box
                h={68}
                className={`${
                  !swap ? "hidden" : "flex"
                } w-full bg-black relative flex items-center`}
              >
                <Box
                  title="Goto home"
                  onClick={() => router.push("/")}
                  className="w-[150px] h-[40px] overflow-hidden relative flex justify-start bg-transparent cursor-pointer"
                >
                  <Image
                    src="/logo/logo.svg"
                    alt="iLove Real Estate Logo"
                    fill
                    priority
                    sizes="(min-width: 808px) 50vw, 100vw"
                  />
                </Box>
                <Box
                  onClick={() => setSwap((e) => !e)}
                  w={49}
                  h={49}
                  bg="white"
                  className="flex justify-center items-center rounded-full p-1 absolute -right-6"
                >
                  <ActionIcon
                    variant="transparent"
                    className="bg-black rounded-full w-full h-full text-white"
                  >
                    <IconArrowLeft />
                  </ActionIcon>
                </Box>
              </Box>
            </Navbar.Section>
            <Navbar.Section grow pb={20}>
              {dashboardItems.map((item) => (
                <Link
                  href={item.link}
                  key={item.id}
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault();
                      setMountLogout(true);
                    }
                  }}
                  className="no-underline text-black "
                >
                  <Group
                    title={item.title.toUpperCase()}
                    spacing={15}
                    position="center"
                    h={47}
                    className={`${
                      !swap ? "pl-0 " : "pl-4 hover:pl-8 duration-500"
                    } border-dashed border-b border-t-0 border-l-0 border-r-0 hover:text-primary-700 `}
                  >
                    <ThemeIcon variant="transparent">
                      <item.icon size={24} />
                    </ThemeIcon>
                    <Text
                      fz={16}
                      fw={400}
                      tt="capitalize"
                      className={`${
                        !swap ? "hidden" : "flex"
                      } font-manrope-regular flex-1 `}
                    >
                      {item.title}
                    </Text>
                  </Group>
                </Link>
              ))}
            </Navbar.Section>
          </Navbar>
        }
        footer={
          <Footer height={60} p="xs" className="text-center">
            Copyright @ 2023 iLove Real Estate. All Rights Reserved
          </Footer>
        }
        header={
          <Header
            height={{ base: 50, md: 68 }}
            p="md"
            className="shadow-md shadow-black/30 flex items-center justify-center md:block "
          >
            <Box className="md:hidden flex items-center  ">
              <Box
                title="Goto home"
                onClick={() => router.push("/")}
                className="w-[200px] h-[30px] overflow-hidden relative flex justify-start bg-transparent cursor-pointer"
              >
                <Image
                  src="/logo/logo.svg"
                  alt="iLove Real Estate Logo"
                  fill
                  priority
                  sizes="(min-width: 808px) 50vw, 100vw"
                />
              </Box>
            </Box>
            <div
              className={`${
                swap ? "justify-end" : "justify-between"
              } md:flex md:items-center hidden h-full `}
            >
              <Box
                className={`${
                  swap ? "hidden" : "flex"
                } hover:bg-primary-700/20 rounded-full p-2`}
              >
                <Burger
                  onClick={() => setSwap((e) => !e)}
                  opened={swap}
                  size="sm"
                  color={theme.colors.primary[0]}
                />
              </Box>
              <Button
                onClick={() => router.push("/dashboard/add-property")}
                leftIcon={
                  <Paper
                    withBorder
                    className="rounded-full flex items-center justify-center w-6 h-6"
                  >
                    <IconPlus size={18} />
                  </Paper>
                }
                variant="subtle"
                className="text-base font-manrope-medium capitalize text-white font-medium hover:bg-primary-700 bg-primary-700"
              >
                add property
              </Button>
            </div>
          </Header>
        }
      >
        <Container size={1626} px={0}>
          {children}
        </Container>
      </AppShell>
      {mountLogout && (
        <LogoutConfirm opened={mountLogout} close={handleClose} />
      )}
    </>
  );
}
