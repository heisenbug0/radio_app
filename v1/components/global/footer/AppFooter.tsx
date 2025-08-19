import { Box, Container, Text, Divider, SimpleGrid } from "@mantine/core";
import FooterContact from "./FooterContact";
import FooterPages from "./FooterPages";
import FooterDownload from "./FooterDownload";
import Image from "next/image";

export default function AppFooter() {
  return (
    <footer className="min-h-[545px] w-full bg-[#282F39] pt-12 ">
      <Container size={1650} px={0}>
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: "62rem", cols: 2, spacing: "md" },
            { maxWidth: "48rem", cols: 2, spacing: "sm" },
            { maxWidth: "36rem", cols: 1, spacing: "sm" },
          ]}
          className="w-full px-6 xl:px-9"
        >
          <Box mb={25}>
            <Box className="w-[200px] h-[65px] overflow-hidden relative flex justify-start mb-5 ">
              <Image
                src="/logo/logo.svg"
                alt="iLove Real Estate Logo"
                fill
                priority
                sizes="(min-width: 808px) 50vw, 100vw"
              />
            </Box>
            <FooterContact />
          </Box>

          <Box mb={25}>
            <FooterPages />
          </Box>
          <Box>
            <FooterDownload />
          </Box>
        </SimpleGrid>

        <Divider mt={40} />
        <Box px="xs" className="py-8">
          <Text className="text-base text-white font-manrope-regular text-center">
            © {new Date().getFullYear()} ILoveRealEstates.com All rights
            reserved.
          </Text>
        </Box>
      </Container>
    </footer>
  );
}
