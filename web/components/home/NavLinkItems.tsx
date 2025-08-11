import { Box, NavLink } from "@mantine/core";

import classes from "./home.module.css";
import { HomeIcon } from "../icons/Home";
import { NextEventIcon } from "../icons/NextEvent";
import CreateIcon from "../icons/Create";
import VideoIcon from "../icons/Video";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrevEventIcon } from "../icons/PrevEvent";

const data = [
  {
    icon: HomeIcon,
    label: "Home",
    route: "/",
  },
  {
    icon: NextEventIcon,
    label: "Upcoming",
    route: "/upcoming",
  },
  {
    icon: PrevEventIcon,
    label: "Previous",
    route: "/previous",
  },
  {
    icon: VideoIcon,
    label: "Recordings",
    route: "/recordings",
  },
  {
    icon: CreateIcon,
    label: "Personal Room",
    route: "/personal-room",
  },
];

export default function NavLinkItems({
  toggleDrawer,
}: {
  toggleDrawer: () => void;
}) {
  const pathname = usePathname();

  const items = data.map((item, index) => (
    <NavLink
      h={56}
      component={Link}
      mt="xs"
      href={item.route}
      key={item.label}
      active={pathname === item.route}
      label={item.label}
      leftSection={<item.icon />}
      onClick={() => toggleDrawer()}
      variant="filled"
      classNames={{
        label: classes.navlink_label,
        root: classes.navlink_body,
      }}
    />
  ));

  return <Box className={classes.box_width}>{items}</Box>;
}
