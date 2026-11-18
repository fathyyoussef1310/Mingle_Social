import "dotenv/config";
export const config = {
  db: {
    url: process.env.DB_URL as string,
  },
  port: process.env.PORT || "3000",
  mailJet: {
    apiKey: process.env.MAILJET_API_KEY || "",
    apiSecret: process.env.MAILJET_API_SECRET || "",
  },
  mail: {
    fromEmail: process.env.MAIL_FROM_EMAIL || "test@example.com",
    fromName: process.env.MAIL_FROM_NAME || "Social Media App",
  },
  nodeMailer: {
    host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.NODEMAILER_PORT || "587", 10),
    secure: process.env.NODEMAILER_SECURE === "true",
    auth: {
      user: (process.env.NODEMAILER_AUTH_USER as string) || "",
      pass: (process.env.NODEMAILER_AUTH_PASS as string) || "",
    },
  },
  jwt: {
    secret: (process.env.JWT_SECRET as string) || (process.env.JWT_ACCESS_SECRET as string) || "default_jwt_secret_key_at_least_32_characters",
    accessSecret: (process.env.JWT_ACCESS_SECRET as string) || (process.env.JWT_SECRET as string) || "default_jwt_secret_key_at_least_32_characters",
    refreshSecret: (process.env.JWT_REFRESH_SECRET as string) || (process.env.JWT_SECRET as string) || "default_refresh_jwt_secret_key_at_least_32_characters",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  redis: {
    user: process.env.user,
    host: process.env.HOST_REDIS || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.password,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
  },
};
