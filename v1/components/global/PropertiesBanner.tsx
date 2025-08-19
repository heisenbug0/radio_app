import { Box, Title } from "@mantine/core";
import { NavHeader } from "../header/NavHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PropertiesBanner() {
  const [title, setTitle] = useState<string>("");
  const router = useRouter();
  const nextPath = router.asPath.split("/")[2];
  const nonNextPath = router.asPath.split("/")[1];
  const { id } = router?.query;

  useEffect(() => {
    switch (nonNextPath) {
      case "properties":
        setTitle("all properties");
        break;
      case "packages":
        setTitle("package plans");
        break;
      case "articles":
        setTitle("articles");
        break;
      case `articles?id=${id}`:
        setTitle("articles");
        break;
      case "categories":
        setTitle("all categories");
        break;
      case "cities":
        setTitle("properties nearby cities");
        break;

      default:
        setTitle(nonNextPath);
        break;
    }
  }, [id, nonNextPath]);

  useEffect(() => {
    switch (nextPath) {
      case "featured-properties":
        setTitle("featured properties");
        break;
      case "most-viewed-properties":
        setTitle("most viewed properties");
        break;
      case "most-favourite-properties":
        setTitle("most favourite properties");
        break;
      case "most-favourite-properties":
        setTitle("most favourite properties");
        break;
      case "search":
        setTitle("search results");
        break;
      case `${id}`:
        if (nonNextPath.toLowerCase() === "properties") setTitle("");
        else if (nonNextPath.toLowerCase() === "realtors")
          setTitle("Realtor Properties");
        else setTitle("article details");
        break;
      case "undefined":
        break;

      default:
        if (nextPath?.includes("?")) {
          setTitle(nextPath.split("?")[0]);
        } else if (nextPath?.includes("%20")) {
          setTitle(nextPath.split("%20").join(" "));
        } else if (nextPath) setTitle(nextPath);
        break;
    }
  }, [nextPath, id, nonNextPath]);

  return (
    <main className="w-full ">
      <Box className="w-full h-[390px] bgOverlay ">
        <Box
          h={70}
          className="top-0 fixed z-10 w-full flex items-center bg-white scrollHeaderTransition shadow-sm"
        >
          <NavHeader />
        </Box>
        <Box className="h-[390px] flex items-center justify-center ">
          <Title
            order={1}
            className="text-white font-manrope-semibold capitalize text-3xl"
          >
            {title}
          </Title>
        </Box>
      </Box>
    </main>
  );
}
