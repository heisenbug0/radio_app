import { Icon } from "@iconify/react";

import { SideNavItem } from "../types";

export const ADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Investments",
    path: "/admin/investments",
    icon: <Icon icon="lucide:columns" width="24" height="24" />,
  },
  {
    title: "Transactions",
    path: "/admin/transactions",
    icon: <Icon icon="lucide:wallet" width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "Personal Info", path: "/admin/settings" },
      { title: "Account", path: "/admin/settings/accounts" },
      { title: "Security", path: "/admin/settings/security" },
      // { title: "Security alerts", path: "/admin/settings/alerts" },
    ],
  },
  {
    title: "Help",
    path: "/admin/help",
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];
