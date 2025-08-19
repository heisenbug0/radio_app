import { Box, Text } from "@mantine/core";
import Link from "next/link";

const links = [
  {
    id: 1,
    title: "all properties",
    link: "/properties",
  },
  {
    id: 2,
    title: "featured properties",
    link: "/properties/featured-properties",
  },
  {
    id: 3,
    title: "most viewed properties",
    link: "/properties/most-viewed-properties",
  },
  {
    id: 4,
    title: "nearby cities properties",
    link: "/cities",
  },
  {
    id: 5,
    title: "most favourite properties",
    link: "/properties/most-favourite-properties",
  },
  {
    id: 6,
    title: "packages",
    link: "/packages",
  },
  {
    id: 7,
    title: "articles",
    link: "/articles",
  },
];
export default function FooterPages() {
  return (
    <Box>
      <Text
        mb={15}
        fz={26}
        className="capitalize text-white font-manrope-semibold"
      >
        links
      </Text>
      {links.map((link) => (
        <Text
          component={Link}
          key={link.id}
          href={link.link}
          className="text-sm font-manrope-regular text-white capitalize block mt-5 w-fit"
        >
          {link.title}
        </Text>
      ))}
    </Box>
  );
}
