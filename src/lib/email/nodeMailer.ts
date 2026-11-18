import nodemailer from "nodemailer";
import { config } from "../config/env";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.nodeMailer.auth.user,
        pass: config.nodeMailer.auth.pass,
    }
});

export async function sendEmail(email:string, code:string) {
    const message = await transporter.sendMail({
        from:`"FaceBookClone-APP" <${config.nodeMailer.auth.user}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${code}`,
    });
    return message;
}