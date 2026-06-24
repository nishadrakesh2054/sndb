import type { ReactNode } from "react";
import {
  PageContainer,
  PageHeader,
  PageSection,
} from "@/components/PageHeader";
import AboutSubnav from "@/components/about/AboutSubnav";

type AboutPageShellProps = {
  label: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
};

const AboutPageShell = ({
  label,
  title,
  subtitle,
  children,
}: AboutPageShellProps) => (
  <PageSection>
    <PageContainer>
      <PageHeader label={label} title={title} subtitle={subtitle} />
      <AboutSubnav />
      {children}
    </PageContainer>
  </PageSection>
);

export default AboutPageShell;
