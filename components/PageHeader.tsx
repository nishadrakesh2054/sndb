import type { ReactNode } from "react";

export const PAGE_SECTION = "bg-gray-50 py-10 md:py-14";
export const PAGE_CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
export const PAGE_TITLE_ACCENT = "text-green-600";

type PageHeaderProps = {
  label: string;
  title: ReactNode;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  align?: "center" | "left";
  className?: string;
};

export function PageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${PAGE_SECTION} ${className}`.trim()}>
      {children}
    </section>
  );
}

export function PageContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${PAGE_CONTAINER} ${className}`.trim()}>{children}</div>
  );
}

export function PageHeader({
  label,
  title,
  subtitle,
  as: Heading = "h1",
  align = "center",
  className = "",
}: PageHeaderProps) {
  const wrapClass =
    align === "center"
      ? "mx-auto mb-8 max-w-2xl text-center md:mb-10"
      : "mb-8 md:mb-10";

  return (
    <div className={`${wrapClass} ${className}`.trim()}>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-green-700">
        {label}
      </p>
      <Heading className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
        {title}
      </Heading>
      {subtitle ? (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function SectionHeader({
  label,
  heading,
  description,
  as = "h2",
}: {
  label: string;
  heading: string;
  description?: string;
  as?: "h2" | "h3";
}) {
  const Heading = as;

  return (
    <div className="mb-6 md:mb-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-green-700">
        {label}
      </p>
      <Heading className="text-xl font-bold text-gray-900 sm:text-2xl">
        {heading}
      </Heading>
      {description ? (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}

export function PageSubsection({
  label,
  heading,
  description,
  children,
}: {
  label: string;
  heading: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 pt-10 first:border-0 first:pt-0 md:pt-12">
      <SectionHeader
        label={label}
        heading={heading}
        description={description}
      />
      {children}
    </section>
  );
}
