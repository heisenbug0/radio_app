import { Box } from "@mantine/core";
import { NavHeader } from "../header/NavHeader";
import HomeHero from "../home/home_hero/HomeHero";
import HomeReels from "../home/home_hero/HomeReels";

export default function HomeBanner() {
  return (
    <main>
      <Box
        h={70}
        className="top-0 fixed w-full flex items-center bg-white scrollHeaderTransition shadow-sm z-30 "
      >
        <NavHeader />
      </Box>
      <Box mt={80} className="md:hidden" mb={20}>
        <HomeReels />
      </Box>
      <Box px={24} mt={{ base: 0, sm: 80 }}>
        <HomeHero />
      </Box>
      <Box className="hidden md:flex">
        <HomeReels />
      </Box>
    </main>
  );
}
