import StreamVideoProvider from "@/callProviders/StreamClientProvider";
import { Box } from "@mantine/core";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Afrimeet",
  description: "inmotion hub video calling app",
  icons: {
    icon: "/logo.svg",
  },
};
const HomeRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bg="dark_colors.1" mih={"100dvh"}>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </Box>
  );
};

export default HomeRootLayout;
