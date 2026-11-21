/**
 * EMAIL PROVIDER INITIALIZATION & FACTORY
 *
 * Responsibility:
 * Instantiates and exports singleton instances of the application's email delivery providers
 * (`mailJetProvider` and `nodeMailerProvider`).
 *
 * Why does this file exist?
 * To configure concrete email drivers using centralized environment settings in one place.
 * By instantiating them here and injecting them through the `MailProvider` interface into services,
 * the application satisfies the **Dependency Inversion Principle (DIP)**.
 *
 * Architecture:
 * Infrastructure Layer / Email Provider Singletons.
 *
 * Dependencies:
 * - `src/pkg/email/mailjet`: Mailjet REST API driver.
 * - `src/pkg/email/nodeMailer`: Nodemailer SMTP driver.
 * - `src/lib/config/env`: API keys, SMTP credentials, and sender identities.
 *
 * Used by:
 * - `src/app/auth/service/auth.service.ts`: Uses `mailJetProvider` as its default email sender.
 *
 * Application Flow:
 * Application starts -> `initEmail.ts` prepares client singletons -> `AuthServices` dispatches emails through them.
 */

// Import Mailjet REST API provider implementation
import { MailJetProvider } from "../../pkg/email/mailjet";

// Import application configuration
import { config } from "../config/env";

// Import Nodemailer SMTP provider implementation
import { NodeMailerProvider } from "../../pkg/email/nodeMailer";

/**
 * Singleton instance of MailJetProvider configured with environment credentials.
 * Used as the primary high-throughput transactional email provider for verification OTPs.
 */
export const mailJetProvider = new MailJetProvider({
    apiKey: config.mailJet.apiKey,
    apiSecret: config.mailJet.apiSecret,
    fromEmail: config.mail.fromEmail,
    fromName: config.mail.fromName,
});

/**
 * Singleton instance of NodeMailerProvider configured with SMTP credentials.
 * Available as an alternate or fallback email delivery mechanism.
 */
export const nodeMailerProvider = new NodeMailerProvider(config.nodeMailer);
