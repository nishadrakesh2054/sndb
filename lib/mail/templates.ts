import { site } from "@/lib/site";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 12px 8px 0;font-weight:600;color:#374151;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#111827;">${escapeHtml(value)}</td>
  </tr>`;
}

function wrapEmail(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#16a34a;color:#ffffff;padding:18px 24px;font-size:18px;font-weight:700;">
                ${escapeHtml(site.shortName)}
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#111827;">${escapeHtml(title)}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                ${escapeHtml(site.name)} · ${escapeHtml(site.email)} · ${escapeHtml(site.phone)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type ContactEmailPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type MembershipEmailPayload = {
  name: string;
  email: string;
  phone: string;
  position: string;
  college_name: string;
  passing_year: string;
  nmc_reg_no: string;
  current_working_place: string;
  bloodgroup: string;
  address: string;
};

export function buildContactUserEmail(data: ContactEmailPayload) {
  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(data.name)},</p>
    <p style="margin:0 0 16px;">Thank you for contacting ${escapeHtml(site.shortName)}. We have received your message and our team will get back to you as soon as possible.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 16px;">
      ${row("Your message", data.message)}
    </table>
    <p style="margin:0;">Best regards,<br />${escapeHtml(site.shortName)} Team</p>
  `;

  return {
    subject: `We received your message — ${site.shortName}`,
    html: wrapEmail("Message Received", body),
  };
}

export function buildContactAdminEmail(data: ContactEmailPayload) {
  const body = `
    <p style="margin:0 0 16px;">A new contact form submission was received on the website.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Message", data.message)}
    </table>
  `;

  return {
    subject: `New contact message from ${data.name}`,
    html: wrapEmail("New Contact Message", body),
  };
}

export function buildMembershipUserEmail(data: MembershipEmailPayload) {
  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(data.name)},</p>
    <p style="margin:0 0 16px;">Thank you for applying for membership with ${escapeHtml(site.shortName)}. We have received your application and will review it shortly.</p>
    <p style="margin:0 0 16px;">If we need any additional information, we will contact you at this email address or phone number.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 16px;">
      ${row("Position", data.position)}
      ${row("College", data.college_name)}
      ${row("Passing year", data.passing_year)}
      ${row("NMC reg. no.", data.nmc_reg_no)}
    </table>
    <p style="margin:0;">Best regards,<br />${escapeHtml(site.shortName)} Team</p>
  `;

  return {
    subject: `Membership application received — ${site.shortName}`,
    html: wrapEmail("Application Received", body),
  };
}

export function buildMembershipAdminEmail(data: MembershipEmailPayload) {
  const body = `
    <p style="margin:0 0 16px;">A new membership application was submitted on the website. Profile photo and payment voucher are available in the dashboard.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Position", data.position)}
      ${row("College", data.college_name)}
      ${row("Passing year", data.passing_year)}
      ${row("NMC reg. no.", data.nmc_reg_no)}
      ${row("Working place", data.current_working_place)}
      ${row("Blood group", data.bloodgroup)}
      ${row("Address", data.address)}
    </table>
  `;

  return {
    subject: `New membership application — ${data.name}`,
    html: wrapEmail("New Membership Application", body),
  };
}
