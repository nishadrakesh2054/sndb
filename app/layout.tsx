import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogoTop from "@/components/LogoTop";
import NoticePopup from "@/components/NoticePopup";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: {
    default: "SNDB | Society of Nepal Doctors of Bangladesh",
    template: "%s | SNDB",
  },
  description:
    "Society for Nepalese Doctors from Bangladesh (SNDB) — professional network for Nepalese doctors who trained in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Topbar />
        <LogoTop />
        <Header />
        <NoticePopup />
        {children}
        <Footer />
      </body>
    </html>
  );
}
