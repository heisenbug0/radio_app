import {
  Group,
  Button,
  Center,
  Container,
  Menu,
  Drawer,
  NavLink,
  Box,
  Burger,
  Divider,
  Paper,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { links } from "@/data/links";
import LogoutConfirm from "../modal/LogoutConfirm";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const LoginModal = dynamic(() => import("../modal/LoginModal"));
const LoggedInMenu = dynamic(() => import("../global/LoggedInMenu"));
const AreaConverter = dynamic(() => import("../modal/AreaConverter"));

export function NavHeader() {
  const [drawerOpened, { toggle, close: closeDrawer }] = useDisclosure(false); // drawer and burger
  const [mount, setMount] = useState<boolean>(false); // login modal
  const [mountConverter, setMountConverter] = useState<boolean>(false); // area converter modal
  const [mountLogout, setMountLogout] = useState<boolean>(false); // logout modal
  const [conversion, setConversion] = useState<string>("");
  const access = Cookies.get("access_token");
  const router = useRouter();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item, index) => (
      <Link
        key={index}
        href={item.link}
        className="no-underline "
        onClick={(e) => {
          if (item.modal) {
            e.preventDefault();
            setMountConverter(true);
          }
        }}
      >
        <Menu.Item className="bg-transparent pl-4 hover:pl-8 duration-500 no-underline hover:text-primary-700 font-manrope-medium text-sm py-1 text-black ">
          {item.label}
        </Menu.Item>
      </Link>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          transitionProps={{ exitDuration: 0 }}
          withinPortal
        >
          <Menu.Target>
            <Link
              href={link.link}
              className="text-black font-manrope-regular capitalize no-underline text-sm"
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className="mr-1 ">{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={3.5} />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    return (
      <Link
        key={link.label}
        href={link.link}
        className="font-manrope-regular no-underline text-sm text-black"
      >
        {link.label}
      </Link>
    );
  });

  const handleClose = () => setMountLogout(false);
  const handleCloseLogin = () => setMount(false);

  function handleCloseConverter() {
    setMountConverter(false);
    setConversion("");
  }

  function handleOpenLogin() {
    setMount(true);
    closeDrawer();
  }
  return (
    <>
      <header className="h-[70px] w-full z-10">
        <Container size={1650} className="w-full h-full">
          <div className="w-full h-full flex justify-between items-center">
            <Link href="/">
              <Box className="w-[100px] h-[30px] overflow-hidden relative flex bg-transparent ">
                <Image
                  src="/logo/logo.webp"
                  alt="iLove Real Estate Logo"
                  fill
                  priority
                  sizes="(min-width: 808px) 50vw, 100vw"
                />
              </Box>
            </Link>
            <Box className="lg:hidden ">
              <Burger opened={drawerOpened} onClick={toggle} size="md" />
            </Box>
            <Box className="hidden lg:flex">
              <Group spacing={25}>{items}</Group>
              {access ? (
                <LoggedInMenu setMount={setMountLogout} />
              ) : (
                <Flex ml={16} gap={16}>
                  <Button
                    onClick={handleOpenLogin}
                    radius={100}
                    variant="white"
                    tt="capitalize"
                    bg="primary.0"
                    fz={13}
                    fw={500}
                    className="font-manrope-medium text-white"
                  >
                    Login/Register
                  </Button>
                </Flex>
              )}
            </Box>
          </div>
        </Container>
      </header>

      <Drawer
        size="60%"
        position="bottom"
        zIndex={2}
        opened={drawerOpened}
        onClose={closeDrawer}
        withCloseButton={false}
        transitionProps={{
          transition: "slide-up",
          duration: 150,
          timingFunction: "linear",
        }}
        styles={() => ({
          body: {
            height: "100%",
            fontFamily: "manrope-medium",
          },
        })}
      >
        {links.map((item, index) => (
          <NavLink
            // onClick={closeDrawer}
            component={Link}
            href={item.link}
            key={index}
            label={item.label}
            childrenOffset={28}
            noWrap
            styles={() => ({
              label: {
                fontSize: 16,
                textTransform: "capitalize",
                fontFamily: "manrope-medium",
              },
            })}
          >
            {item.links &&
              item.links.map((elem, index) => (
                <NavLink
                  noWrap
                  variant="filled"
                  component={Link}
                  href={elem.link}
                  key={index}
                  label={elem.label}
                  onClick={(e) => {
                    if (elem.modal) {
                      e.preventDefault();
                      setMountConverter(true);
                      closeDrawer();
                    }
                  }}
                  styles={() => ({
                    label: {
                      fontSize: 16,
                      textTransform: "capitalize",
                      fontFamily: "manrope-medium",
                    },
                  })}
                />
              ))}
          </NavLink>
        ))}
        {access && (
          <>
            <NavLink
              onClick={closeDrawer}
              noWrap
              variant="filled"
              component={Link}
              href="/dashboard"
              label="Dashboard"
              styles={() => ({
                label: {
                  fontSize: 16,
                  textTransform: "capitalize",
                  fontFamily: "manrope-medium",
                },
              })}
            />
            <NavLink
              onClick={closeDrawer}
              noWrap
              variant="filled"
              component={Link}
              href="/dashboard/reels"
              label="My Reels"
              styles={() => ({
                label: {
                  fontSize: 16,
                  textTransform: "capitalize",
                  fontFamily: "manrope-medium",
                },
              })}
            />
          </>
        )}
        <Divider my={20} />

        {access ? (
          <>
            <Box className="flex space-x-3">
              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  setMountLogout(true);
                  closeDrawer();
                }}
                className="text-base bg-red-700 font-manrope-medium capitalize font-medium hover:bg-red-800"
              >
                Logout
              </Button>
              <Button
                fullWidth
                size="lg"
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
                className="text-base font-manrope-medium capitalize text-white font-medium hover:bg-black bg-black"
              >
                add property
              </Button>
            </Box>
          </>
        ) : (
          <Box className="flex space-x-3  ">
            <Link href="/register" className="w-full no-underline">
              <Button
                fullWidth
                className="text-base bg-yellow-700 font-manrope-medium capitalize font-medium hover:bg-yellow-800"
              >
                register
              </Button>
            </Link>
            <Button
              fullWidth
              onClick={handleOpenLogin}
              className="text-base bg-primary-700 font-manrope-medium capitalize font-medium hover:bg-primary-700"
            >
              Login
            </Button>
          </Box>
        )}
      </Drawer>
      <LoginModal opened={mount} close={handleCloseLogin} />
      <AreaConverter
        opened={mountConverter}
        close={handleCloseConverter}
        conversion={conversion}
        setConversion={setConversion}
      />
      <LogoutConfirm opened={mountLogout} close={handleClose} />
    </>
  );
}
