import { Gender } from "../../../lib/enum/enum";

export interface RegisterDto {
    userName: string;
    email: string;
    password: string;
    gender?: Gender;
    phoneNumber?: string;
    name?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface SendOtpDto {
    email: string;
}

export interface VerifyEmailDto {
    email: string;
    code?: string;
    otp?: string;
}

export interface ForgetPasswordDto {
    email: string;
    code?: string;
    otp?: string;
    newPassword?: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface GoogleLoginDto {
    idToken: string;
}

export interface TwoStepVerificationDto {
    email: string;
    code: string;
}
