export const links = [
  { link: "/", label: "Home" },
  {
    link: "#1",
    label: "Properties",
    links: [
      { link: "/properties", label: "All Properties" },
      { link: "/properties/featured-properties", label: "Featured Properties" },
      {
        link: "/properties/most-viewed-properties",
        label: "Most Viewed Properties",
      },
      {
        link: "/cities",
        label: "Properties Nearby Cities ",
      },
      {
        link: "/properties/most-favourite-properties",
        label: "Most Favourite Properties",
      },
    ],
  },
  {
    link: "#2",
    label: "Pages",
    links: [
      { link: "/packages", label: "Packages" },
      { link: "/articles", label: "Articles" },
      { link: "/categories", label: "Categories" },
      { link: "#", label: "Area Converter", modal: true },
      { link: "#", label: "Terms & Condition" },
      { link: "#", label: "Privacy Policy" },
    ],
  },
  { link: "/realtors", label: "Realtors" },
  // { link: "#", label: "Contact Us" },
  // { link: "#", label: "About Us" },
];
