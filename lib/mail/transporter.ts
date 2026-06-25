import nodemailer from "nodemailer";
import { getMailConfig } from "@/lib/mail/config";

let transporter: nodemailer.Transporter | null = null;

export function getMailTransporter() {
  if (!transporter) {
    const config = getMailConfig();

    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  return transporter;
}
