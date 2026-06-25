import { getMailConfig } from "@/lib/mail/config";
import { getMailTransporter } from "@/lib/mail/transporter";
import {
  buildContactAdminEmail,
  buildContactUserEmail,
  buildMembershipAdminEmail,
  buildMembershipUserEmail,
  type ContactEmailPayload,
  type MembershipEmailPayload,
} from "@/lib/mail/templates";

async function sendToRecipients(
  recipients: string[],
  subject: string,
  html: string
) {
  const config = getMailConfig();
  const transporter = getMailTransporter();

  await transporter.sendMail({
    from: config.from,
    to: recipients.join(", "),
    subject,
    html,
  });
}

export async function sendContactEmails(data: ContactEmailPayload) {
  const userEmail = buildContactUserEmail(data);
  const adminEmail = buildContactAdminEmail(data);
  const config = getMailConfig();

  await Promise.all([
    sendToRecipients([data.email], userEmail.subject, userEmail.html),
    sendToRecipients([config.adminEmail], adminEmail.subject, adminEmail.html),
  ]);
}

export async function sendMembershipEmails(data: MembershipEmailPayload) {
  const userEmail = buildMembershipUserEmail(data);
  const adminEmail = buildMembershipAdminEmail(data);
  const config = getMailConfig();

  await Promise.all([
    sendToRecipients([data.email], userEmail.subject, userEmail.html),
    sendToRecipients([config.adminEmail], adminEmail.subject, adminEmail.html),
  ]);
}

export function isMailConfigured() {
  return Boolean(
    process.env.MAIL_HOST &&
      process.env.MAIL_USERNAME &&
      process.env.MAIL_PASSWORD &&
      process.env.ADMIN_EMAIL
  );
}
