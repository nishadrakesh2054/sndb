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
import { getActiveNoticePopupServer } from "@/utils/supabase/noticePopup.server";

export const revalidate = 300;

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const popup = await getActiveNoticePopupServer().catch(() => null);

  return (
    <SiteShell>
      <SkipLink />
      <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
      <Topbar />
      <LogoTop />
      <Header />
      <NoticePopup popup={popup} />
      <main id="main-content">{children}</main>
      <Footer />
    </SiteShell>
  );
}
