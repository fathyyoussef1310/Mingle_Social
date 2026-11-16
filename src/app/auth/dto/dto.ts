import {Gender} from "../../../lib/enum/enum";

// todo contract of auth

export interface RegisterDto{
    userName:String ,
    email:String ,
    password:String,
    gender?:Gender
    phoneNumber?: String,
}
export interface LoginDto{
    email:String ,
    password:String
}
export interface SendOtpDto{
    email:String ,
}
export interface VerifyEmailDto{
    email:String ,
    otp:String
}
export interface ForgetPasswordDto{
    email:String ,
    otp:String
}