import CustomFonts from "@/components/CustomFonts";
import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Notifications } from "@mantine/notifications";
import { SWRConfig } from "swr";
import { AuthGuard } from "./api/auth/AuthGuard";
import { NextPage } from "next";
import { LoadingProvider } from "@/context/LoadingContext";
import { useState, useEffect } from "react";
import InitialLoader from "@/components/InitialLoader";
import "next-cloudinary/dist/cld-video-player.css";
import { SearchProvider } from "@/context/SearchContext";
import TempValueProvider from "@/context/TempContext";

type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

export default function App({
  Component,
  pageProps,
}: {
  Component: NextApplicationPage;
  pageProps: AppProps;
}) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 2000);
  }, [isMounted]);

  return (
    <>
      <Head>
        <title>iLove RealEstate</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="A platform for renting, selling and leasing of properties of any kind."
        />
        <meta name="author" content="ILoveRealEstate.com" />
      </Head>

      {isMounted ? (
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colors: {
              appBg: ["#F4F5F4", "#FFFFFF14", "#282f39"],
              primary: ["#DB066F"],
            },
            colorScheme: "light",
          }}
        >
          <CustomFonts />
          <Notifications position="top-center" />
          <LoadingProvider>
            <TempValueProvider>
              <SearchProvider>
                <SWRConfig
                  value={{
                    errorRetryCount: 3,
                    dedupingInterval: 300000,
                  }}
                >
                  {Component.requireAuth ? (
                    <AuthGuard>
                      <Component {...pageProps} />
                    </AuthGuard>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </SWRConfig>
              </SearchProvider>
            </TempValueProvider>
          </LoadingProvider>
        </MantineProvider>
      ) : (
        <InitialLoader />
      )}
    </>
  );
}
