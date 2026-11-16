import "dotenv/config";
import zod from "zod";
export const config = {
  db: {
    url: process.env.DB_URL as string,
  },
  port: process.env.PORT || "3000",
    mail: {
    fromName: process.env.MAIL_FROM_NAME || "My App",
    fromEmail: process.env.MAIL_FROM_EMAIL || "no-reply@example.com",
  },
  mailJet: {
    apiKey: process.env.MAILJET_API_KEY as string,
    apiSecret: process.env.MAILJET_API_SECRET as string,
  },
  nodeMailer: {
    host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.NODEMAILER_PORT || "587", 10),
    secure: process.env.NODEMAILER_SECURE === "true",
    auth: {
      user: process.env.NODEMAILER_AUTH_USER as string,
      pass: process.env.NODEMAILER_AUTH_PASS as string,
    },
  },
  jwt:{
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  }
};