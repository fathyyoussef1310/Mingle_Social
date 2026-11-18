import { MailJetProvider } from "../../pkg/email/mailjet";
import { config } from "../config/env";
import {NodeMailerProvider} from "../../pkg/email/nodeMailer";

export const mailJetProvider = new MailJetProvider({
    apiKey: config.mailJet.apiKey,
    apiSecret: config.mailJet.apiSecret,
    fromEmail: config.mail.fromEmail,
    fromName: config.mail.fromName,
});



export const nodeMailerProvider = new NodeMailerProvider(config.nodeMailer)