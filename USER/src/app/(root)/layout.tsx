import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
