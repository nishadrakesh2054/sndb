import { site } from "@/lib/site";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getMailConfig() {
  const password = requireEnv("MAIL_PASSWORD").replace(/\s/g, "");

  return {
    host: requireEnv("MAIL_HOST"),
    port: Number(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_ENCRYPTION === "ssl",
    auth: {
      user: requireEnv("MAIL_USERNAME"),
      pass: password,
    },
    from: `"${site.shortName}" <${requireEnv("MAIL_USERNAME")}>`,
    adminEmail: requireEnv("ADMIN_EMAIL"),
  };
}
