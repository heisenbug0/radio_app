import {
  IconAd,
  IconBell,
  IconCategory,
  IconCurrencyNaira,
  IconEye,
  IconHeart,
  IconHistory,
  IconHomePlus,
  IconLogout,
  IconUserCheck,
  IconVideo,
} from "@tabler/icons-react";

export const dashboardItems = [
  {
    id: 1,
    title: "dashboard",
    link: "/dashboard",
    icon: IconCategory,
  },
  {
    id: 2,
    title: "my advertisement",
    link: "/dashboard/advertisement",
    icon: IconAd,
  },
  {
    id: 3,
    title: "add properties",
    link: "/dashboard/add-property",
    icon: IconHomePlus,
  },
  {
    id: 4,
    title: "favourite",
    link: "/dashboard/favourites",
    icon: IconHeart,
  },
  {
    id: 5,
    title: "my profile",
    link: "/dashboard/profile",
    icon: IconUserCheck,
  },
  {
    id: 6,
    title: "my reels",
    link: "/dashboard/reels",
    icon: IconVideo,
  },
  {
    id: 7,
    title: "user notification",
    link: "/dashboard/notification",
    icon: IconBell,
  },
  {
    id: 8,
    title: "my package",
    link: "/dashboard/package",
    icon: IconCurrencyNaira,
  },
  {
    id: 9,
    title: "transaction history",
    link: "/dashboard/transaction-history",
    icon: IconHistory,
  },
  {
    id: 10,
    title: "online viewers",
    link: "/dashboard/online-viewers",
    icon: IconEye,
  },
  {
    id: 11,
    title: "logout",
    link: "#",
    icon: IconLogout,
    action: true,
  },
];
