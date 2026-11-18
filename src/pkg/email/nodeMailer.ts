import nodemailer, { Transporter } from "nodemailer";
import { config } from "../../lib/config/env";
import { MailProvider } from "./mailInterface";

export interface INodeMailerConfig {
  host: string;
  port: number;
  secure: boolean;
  fromName?: string;
  fromEmail?: string;
  auth: {
    user: string;
    pass: string;
  };
}

export class NodeMailerProvider implements MailProvider {
  private readonly transporter: Transporter;
  private readonly fromName: string;
  private readonly fromEmail: string;

  constructor(customConfig?: Partial<INodeMailerConfig>) {
    this.fromName = customConfig?.fromName ?? config.mail.fromName;
    this.fromEmail = customConfig?.fromEmail ?? config.mail.fromEmail;

    this.transporter = nodemailer.createTransport({
      host: customConfig?.host ?? config.nodeMailer.host,
      port: customConfig?.port ?? config.nodeMailer.port,
      secure: customConfig?.secure ?? config.nodeMailer.secure,
      auth: customConfig?.auth ?? {
        user: config.nodeMailer.auth.user,
        pass: config.nodeMailer.auth.pass,
      },
    });
  }
    async sendEmail(email: string, subject: string, html: string): Promise<void> {
        await this.transporter.sendMail({
            from: `${this.fromName} <${this.fromEmail}>`,
            to: email,
            subject: subject,
            html: html,
        });
    }
}