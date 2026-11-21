
import "dotenv/config";
import { z } from "zod";
const schema = z.object({

  DB_URL: z.string().min(1, "DB_URL is required"),
  PORT: z.string().regex(/^\d+$/).default("3000"),

  MAILJET_API_KEY: z.string().default(""),
  MAILJET_API_SECRET: z.string().default(""),
  MAILJET_FROM_NAME: z.string().optional(),
  MAILJET_FROM_EMAIL: z.string().email().optional(),

  // MAIL
  MAIL_FROM_EMAIL: z.string().email().default("test@example.com"),
  MAIL_FROM_NAME: z.string().default("Social Media App"),

  // NODEMAILER
  EMAIL_USER: z.string().optional(),
  PASSWORD_USER: z.string().optional(),
  NODEMAILER_HOST: z.string().default("smtp.gmail.com"),
  NODEMAILER_PORT: z.string().regex(/^\d+$/).default("587"),
  NODEMAILER_SECURE: z.enum(["true", "false"]).default("false"),
  NODEMAILER_AUTH_USER: z.string().default(""),
  NODEMAILER_AUTH_PASS: z.string().default(""),

  // JWT
  JWT_SECRET: z.string().default("default_jwt_secret_key_at_least_32_characters"),
  JWT_ACCESS_SECRET: z.string().default(""),
  JWT_REFRESH_SECRET: z.string().default(""),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // REDIS
  user: z.string().default(""),
  HOST_REDIS: z.string().default("127.0.0.1"),
  REDIS_PORT: z.string().regex(/^\d+$/).default("6379"),
  password: z.string().default(""),

  // GOOGLE
  GOOGLE_CLIENT_ID: z.string().default("mock-google-client-id"),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().default(""),
  AWS_REGION: z.string().default("eu-central-1"),
  AWS_S3_BUCKET_NAME: z.string().default(""),
});
const env = schema.parse(process.env);

export const config = {
  db: {
    url: env.DB_URL,
  },

  port: env.PORT,

  mailJet: {
    apiKey: env.MAILJET_API_KEY,
    apiSecret: env.MAILJET_API_SECRET,
  },

  mail: {
    fromEmail: env.MAILJET_FROM_EMAIL || env.MAIL_FROM_EMAIL,
    fromName: env.MAILJET_FROM_NAME || env.MAIL_FROM_NAME,
  },

  nodeMailer: {
    host: env.NODEMAILER_HOST,
    port: parseInt(env.NODEMAILER_PORT, 10),
    secure: env.NODEMAILER_SECURE === "true",
    auth: {
      user: env.NODEMAILER_AUTH_USER || env.EMAIL_USER || "",
      pass: env.NODEMAILER_AUTH_PASS || env.PASSWORD_USER || "",
    },
  },

  jwt: {
    secret: env.JWT_SECRET,
    accessSecret: env.JWT_ACCESS_SECRET || env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET || env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  redis: {
    user: env.user,
    host: env.HOST_REDIS,
    port: env.REDIS_PORT,
    password: env.password,
  },

  google: {
    clientId: env.GOOGLE_CLIENT_ID,
  },

  s3: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    bucketName: env.AWS_S3_BUCKET_NAME,
  },
};
