import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import { dark_colors, light_colors, other_colors } from "@/constants/colors";
import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "Afrimeet",
  description: "inmotion hub video calling app",
  icons: {
    icon: "/logo.svg",
  },
};

const theme = createTheme({
  colors: {
    dark_colors,
    light_colors,
    other_colors,
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png"></link>
        <meta name="theme-color" content="#000" />
      </head>
      <ClerkProvider
        appearance={{
          variables: {
            colorText: "white",
            colorBackground: "#1C1F2E",
          },
          layout: {
            logoImageUrl: "/logo.svg",
            socialButtonsVariant: "iconButton",
          },
          elements: {
            formButtonPrimary:
              "capitalize font-medium font-Nunito_sans_medium text-base bg-[#0E78F9]",
            headerTitle:
              "font-medium font-Nunito_sans_medium text-white text-white",
            formFieldLabel: "text-base font-medium font-Nunito_sans_medium",
            formFieldInput: "bg-[#252A41] text-white font-Nunito_sans_regular",
            socialButtonsIconButton: "bg-[#C9DDFF] hover:bg-[#252A41] ",
            dividerText:
              "text-white text-sm font-medium font-Nunito_sans_medium",
            dividerLine: "bg-white",
            headerSubtitle: "hidden",
            socialButtons: "-mt-3",
            formField: "-mt-3",
            footerActionText:
              "font-medium font-Nunito_sans_medium text-base text-[#C9DDFF]",
            footerActionLink: "font-medium font-Nunito_sans_medium text-base ",
            userButtonPopoverActionButtonText: "text-dark-1 font-medium",
            userButtonPopoverCard:
              "text-dark-1 bg-white text-2xl font-semibold",
            userPreviewSecondaryIdentifier: "text-dark-1 font-normal",
          },
        }}
      >
        <body suppressHydrationWarning={true}>
          <MantineProvider theme={theme}>
            <Notifications position="top-center" />
            {children}
          </MantineProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
