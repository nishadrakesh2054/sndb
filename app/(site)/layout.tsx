import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogoTop from "@/components/LogoTop";
import NoticePopup from "@/components/NoticePopup";
import SiteShell from "@/components/SiteShell";
import SkipLink from "@/components/SkipLink";
import JsonLd from "@/components/seo/JsonLd";
import Topbar from "@/components/Topbar";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SiteShell>
      <SkipLink />
      <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
      <Topbar />
      <LogoTop />
      <Header />
      <NoticePopup />
      <main id="main-content">{children}</main>
      <Footer />
    </SiteShell>
  );
}
