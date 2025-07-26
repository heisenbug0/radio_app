import { Icon } from "@iconify/react";

import { SideNavItem } from "./types";

export const USER_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "My plans",
    path: "/user/myplans",
    icon: <Icon icon="lucide:align-justify" width="24" height="24" />,
  },
  {
    title: "Transactions",
    path: "/user/transactions",
    icon: <Icon icon="lucide:wallet" width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/user/settings",
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "Personal Info", path: "/user/settings" },
      { title: "Account", path: "/user/settings/account" },
      { title: "Security", path: "/user/settings/security" },
      // { title: "Security alerts", path: "/user/settings/alerts" },
    ],
  },
  {
    title: "Tasks",
    path: "/user/tasks",
    icon: <Icon icon="lucide:clipboard-check" width="24" height="24" />,
  },
  {
    title: "Help",
    path: "/user/help",
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];
