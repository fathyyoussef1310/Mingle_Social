import Mailjet from "node-mailjet";
import { MailProvider } from "./mailInterface";
interface MailJetConfig {
    apiKey: string;
    apiSecret: string;
    fromEmail: string;
   fromName: string;
}
export class MailJetProvider implements MailProvider {
    private client: Mailjet | null = null;
    private readonly fromName: string;
    private readonly fromEmail: string;
    constructor(config: MailJetConfig) {
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
        if (config.apiKey && config.apiSecret) {
            this.client = new Mailjet({
                apiKey: config.apiKey,
                apiSecret: config.apiSecret,
            });
        }
    }

    async sendEmail(email: string, subject: string, html: string): Promise<void> {
        if (!this.client) {
            console.warn(`[MailJet] MailJet is not configured. Email to ${email} skipped.`);
            return;
        }
        await this.client.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Name: this.fromName,
                        Email: this.fromEmail,
                    },
                    To: [
                        {
                            Email: email,
                            Name: email,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: html,
                },
            ],
        });
    }
}

export default MailJetProvider;
