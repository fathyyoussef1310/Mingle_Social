export interface MailProvider {

    sendEmail(email: string, subject: string, html: string): Promise<void>;
}

export default MailProvider;
