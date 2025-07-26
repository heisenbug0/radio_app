import { Icon } from "@iconify/react";

import { SideNavItem } from "../types";

export const SUPERADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/superadmin",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Management",
    path: "/superadmin/management",
    icon: <Icon icon="lucide:user-cog-2" width="24" height="24" />,
  },
  {
    title: "Transactions",
    path: "/superadmin/transactions",
    icon: <Icon icon="lucide:wallet" width="24" height="24" />,
  },
  {
    title: "Investments",
    path: "/superadmin/investments",
    icon: <Icon icon="lucide:columns" width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/superadmin/settings",
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "Personal Info", path: "/superadmin/settings" },
      { title: "Account", path: "/superadmin/settings/accounts" },
      { title: "Security", path: "/superadmin/settings/security" },
      // { title: "Security alerts", path: "/admin/settings/alerts" },
    ],
  },
];
