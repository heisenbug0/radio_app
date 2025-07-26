import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";

//Components
import Header from "@/components/user/header";
import HeaderMobile from "@/components/user/header-mobile";
import Sidebar from "@/components/user/sidebar";
import PageWrapper from "@/components/user/page-wrapper";
import MarginWrapper from "@/components/user/margin-width-wrapper";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freemann Firms",
  description: "Freemann Firms Investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-white ${inter.className}`}>
        <div className="flex lg:gap-5 sm:gap-1">
          <Sidebar />
          <main className="max-w-full flex-1 mx-auto">
            <MarginWrapper>
              <Header />
              <HeaderMobile />
              <PageWrapper>{children}</PageWrapper>
            </MarginWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
