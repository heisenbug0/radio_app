import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/header";
import HeaderMobile from "@/components/admin/header-mobile";
import PageWrapper from "@/components/admin/page-wrapper";
import MarginWrapper from "@/components/admin/margin-width-wrapper";
import AuthGuard from "@/components/AuthGuard";

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
        <AuthGuard allowedRoles={["manager"]}>
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
        </AuthGuard>
      </body>
    </html>
  );
}
