import {ForgetPasswordDto, LoginDto, RegisterDto, SendOtpDto, VerifyEmailDto} from "../dto/dto";

class AuthServices{   /////////Auth Operations
    constructor() {
    }
    async register(userData:RegisterDto){

    }
    async login(userData:LoginDto){

    }
    async verifyAccount(userData:VerifyEmailDto){

    }
    async forgetPassword(userData:ForgetPasswordDto){

    }
    async sendOtp(userData:SendOtpDto){

    }
}
///Simulate S in Solid Principles
const AuthService = new AuthServices();
export  default  AuthService;