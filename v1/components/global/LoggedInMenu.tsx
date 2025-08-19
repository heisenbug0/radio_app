import { Group, Menu, Center, Button, Paper } from "@mantine/core";
import { IconMoodSmile, IconChevronDown, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import useUser from "@/hooks/useUser";

export default function LoggedInMenu({
  setMount,
}: {
  setMount: Dispatch<SetStateAction<boolean>>;
}) {
  // const scrollPosition = useScrollPosition();
  const router = useRouter();
  const { user } = useUser();

  return (
    <Group ml={16}>
      <Menu transitionProps={{ exitDuration: 0 }} withinPortal>
        <Menu.Target>
          <Link
            href="#"
            className="font-manrope-regular capitalize no-underline text-sm text-black "
            onClick={(event) => event.preventDefault()}
          >
            <Center>
              <IconMoodSmile size="0.9rem" />
              <span className="mx-1 ">{user?.name.split(" ")[0]}</span>
              <IconChevronDown size="0.9rem" stroke={3.5} />
            </Center>
          </Link>
        </Menu.Target>
        <Menu.Dropdown>
          <Link href="/dashboard" className="no-underline">
            <Menu.Item className="hover:text-primary-700">Dashboard</Menu.Item>
          </Link>
          <Link href="/dashboard/reels" className="no-underline">
            <Menu.Item className="hover:text-primary-700 capitalize">
              my reels
            </Menu.Item>
          </Link>
          <Menu.Item
            className="hover:text-primary-700"
            onClick={() => {
              setMount(true);
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button
        onClick={() => router.push("/dashboard/add-property")}
        leftIcon={
          <Paper
            withBorder
            className="rounded-full flex items-center justify-center w-6 h-6 text-primary-700"
          >
            <IconPlus size={18} />
          </Paper>
        }
        ml={16}
        radius={100}
        variant="white"
        tt="capitalize"
        bg="primary.0"
        fz={13}
        fw={500}
        className="font-manrope-medium text-white"
      >
        add property
      </Button>
    </Group>
  );
}
