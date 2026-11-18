import {
    ForgetPasswordDto,
    GoogleLoginDto,
    LoginDto,
    RegisterDto,
    SendOtpDto,
    VerifyEmailDto,
} from "../dto/dto";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { toMins } from "../../../pkg/utils/time";
import { AppError } from "../../../lib/error/AppError";
import { mailJetProvider } from "../../../lib/email/initEmail";
import { MailProvider } from "../../../pkg/email/mailInterface";
import { cacheProvider } from "../../../lib/cache/init";
import { ICacheProvider } from "../../../pkg/cache/cacheInterface";
import { generateOtpEmail } from "../../../lib/utils/otp.generator";
import { comparePassword, hashPassword } from "../../../lib/utils/hashPas";
import { verifyGoogleToken } from "../../../lib/utils/googleauth";
import { Otp, OtpDocument } from "../../../lib/models/otp.model";
import { UserRepository, userRepository as defaultUserRepo } from "../../user/repository/user.repository";
import { OtpRepository, otpRepository as defaultOtpRepo } from "../repository/otp.repository";
import { RefreshTokenRepository, refreshTokenRepository as defaultRefreshRepo } from "../repository/refreshToken.repository";
import { TokenService, tokenService as defaultTokenService } from "./token.service";
import { Provider } from "../../../lib/enum/enum";

export class AuthServices {
    // Constants
    private readonly MAX_LOGIN_TRIES = 5;
    private readonly BAN_TTL_MS = toMins(15, "minutes");
    private readonly TRIES_TTL_MS = toMins(15, "minutes");
    private readonly OTP_TTL_MS = toMins(5, "minutes");
    private readonly OTP_CACHE_PREFIX = "OTP:";

    constructor(
        private readonly userRepository: UserRepository = defaultUserRepo,
        private readonly mailProvider: MailProvider = mailJetProvider,
        private readonly otpRepo: OtpRepository = defaultOtpRepo,
        private readonly refreshTokenRepo: RefreshTokenRepository = defaultRefreshRepo,
        private readonly tokenService: TokenService = defaultTokenService,
        private readonly cache: ICacheProvider = cacheProvider
    ) {}

    // Helpers
    private TRIES_KEY(email: string) {
        return `login_tries:${email}`;
    }

    private BAN_KEY(email: string) {
        return `login_banned:${email}`;
    }

    // Helpers for Code Optimization
    public toPublicUser(user: any) {
        return {
            id: user.id || user._id?.toString(),
            email: user.email,
            name: user.userName || user.name,
        };
    }

    public async issuePair(user: any, family: string) {
        const accessToken = this.tokenService.signAccess(user);
        const refreshToken = this.tokenService.signRefresh(user, family);
        const decoded = jwt.decode(refreshToken) as { exp?: number } | null;
        if (!decoded?.exp) {
            throw new AppError("Failed to issue refresh token", 500);
        }
        await this.refreshTokenRepo.create({
            user: user.id || user._id,
            family,
            tokenHash: this.tokenService.hash(refreshToken),
            expiresAt: new Date(decoded.exp * 1000),
        });
        return { accessToken, refreshToken };
    }

    public async createAndStoreOtp(email: string): Promise<string> {
        const code = generateOtpEmail();

        await this.otpRepo.deleteOtp(email);

        await this.cache.del(`${this.OTP_CACHE_PREFIX}${email}`);

        await Otp.create({
            code,
            email,
            expiredAt: new Date(Date.now() + this.OTP_TTL_MS),
        });

        await this.cache.set(
            `${this.OTP_CACHE_PREFIX}${email}`,
            code,
            this.OTP_TTL_MS
        );

        return code;
    }

    public async validateAndConsumeOtp(email: string, code: string): Promise<void> {
        let stored = await this.cache.get(`${this.OTP_CACHE_PREFIX}${email}`);
        if (!stored) {
            const otpDoc = await this.otpRepo.getOtpByEmail(email);
            if (!otpDoc) {
                throw new AppError("OTP expired, please request a new one!", 400);
            }
            stored = otpDoc.code;
        }
        if (String(stored) !== String(code)) {
            throw new AppError("Invalid OTP code!", 400);
        }
        await Promise.all([
            this.cache.del(`${this.OTP_CACHE_PREFIX}${email}`),
            this.otpRepo.deleteOtp(email),
        ]);
    }

    public async requireUserByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("This email doesn't exist!", 404);
        }

        return user;
    }

    public async verifyOtpAndUpdateUser(
        email: string,
        code: string,
        updateData: object
    ) {
        await this.requireUserByEmail(email);

        await this.validateAndConsumeOtp(email, code);

        const updated = await this.userRepository.updateUserByEmail(email, updateData);
        if (!updated) {
            throw new AppError("Failed to update user", 400);
        }

        return this.toPublicUser(updated);
    }

    // Authentication Operations

    async register(userData: RegisterDto) {
        const hashedPassword = await hashPassword(userData.password);
        try {
            const user = await this.userRepository.createUser({
                ...userData,
                userName: userData.userName,
                password: hashedPassword,
                provider: Provider.LOCAL,
            });

            if (!user) {
                throw new AppError("Failed to create user", 400);
            }

            const code = await this.createAndStoreOtp(user.email);

            await this.mailProvider.sendEmail(
                user.email,
                "Verification Code",
                `<h1>Your verification code is ${code}</h1>`
            );

            return this.toPublicUser(user);
        } catch (err: any) {
            if (err.code === 11000) {
                throw new AppError("Email already exists", 409);
            }

            throw err;
        }
    }
    async verifyAccount(userData: VerifyEmailDto) {
        const email = String(userData.email);
        const code = String(userData.code || userData.otp || "");
        if (!code) {
            throw new AppError("OTP code is required", 400);
        }
        const user = await this.requireUserByEmail(email);
        if (user.isVerified) {
            throw new AppError("This email is already verified!", 409);
        }

        return this.verifyOtpAndUpdateUser(email, code, { isVerified: true });
    }

    // Concept of compsation
    async verifyUser(userData: VerifyEmailDto) {
        return this.verifyAccount(userData);
    }

    async enable2Verification(email: string, code: string) {
        return this.verifyOtpAndUpdateUser(email, code, { twoStepVerification: true });
    }

    async verifyAfter2StepVer(email: string, code: string) {
        const user = await this.requireUserByEmail(email);
        await this.validateAndConsumeOtp(email, code);
        const pair = await this.issuePair(user, crypto.randomUUID());

        return {
            ...pair,
            user: this.toPublicUser(user),
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        if (await this.cache.get(this.BAN_KEY(email))) {
            throw new AppError("Too many requests, try again later", 429);
        }

        const user = await this.userRepository.checkUserByEmail(email);
        if (!user) {
            throw new AppError("Invalid email or password!", 401);
        }

        if (user.isVerified !== true) {
            throw new AppError("This email is not verified!", 403);
        }

        const match = await comparePassword(password, user.password || "");

        if (!match) {
            const currentAttempts = Number(await this.cache.get(this.TRIES_KEY(email))) || 0;
            const newAttempts = currentAttempts + 1;

            if (newAttempts >= this.MAX_LOGIN_TRIES) {
                await this.cache.set(this.BAN_KEY(email), "1", this.BAN_TTL_MS);
                await this.cache.del(this.TRIES_KEY(email));
                throw new AppError("Too many failed login attempts. Account Banned", 429);
            }

            await this.cache.set(
                this.TRIES_KEY(email),
                String(newAttempts),
                this.TRIES_TTL_MS
            );

            throw new AppError(
                `Invalid email or password! ${this.MAX_LOGIN_TRIES - newAttempts} attempt(s) remaining.`,
                401
            );
        }

        await this.cache.del(this.TRIES_KEY(email));

        if (user.twoStepVerification === true) {
            const code = await this.createAndStoreOtp(email);

            await this.mailProvider.sendEmail(
                email,
                "2-Step Verification Code",
                `<h3>Your code is ${code}</h3>`
            );

            return {
                requires2FA: true,
                message: "OTP sent to your email",
            };
        }

        const pair = await this.issuePair(user, crypto.randomUUID());

        return {
            ...pair,
            user: this.toPublicUser(user),
        };
    }

    // Alias for compatibility
    async loginUser(loginDtoOrEmail: LoginDto | string, maybePassword?: string) {
        if (typeof loginDtoOrEmail === "string") {
            return this.login({ email: loginDtoOrEmail, password: maybePassword || "" });
        }
        return this.login(loginDtoOrEmail);
    }

    async loginWithGoogle(idToken: string) {
        const payload = await verifyGoogleToken(idToken);

        if (!payload.email_verified || !payload.email) {
            throw new AppError("Google email not verified", 401);
        }

        let user = await this.userRepository.findByEmail(payload.email);

        if (!user) {
            user = await this.userRepository.createUser({
                email: payload.email,
                userName: payload.name || payload.email.split("@")[0] || "google_user",
                provider: Provider.GOOGLE,
                isVerified: true,
            });
        }

        const pair = await this.issuePair(user, crypto.randomUUID());

        return {
            ...pair,
            user: this.toPublicUser(user),
        };
    }

    async sendOtp(dtoOrEmail: SendOtpDto | string) {
        const email = typeof dtoOrEmail === "string" ? dtoOrEmail : dtoOrEmail.email;
        return this.sendOtpEmail(email);
    }

    async sendOtpEmail(email: string) {
        await this.requireUserByEmail(email);

        const code = await this.createAndStoreOtp(email);

        await this.mailProvider.sendEmail(
            email,
            "Verification Code",
            `<h1>Your verification code is ${code}</h1>`
        );

        return {
            message: "OTP sent successfully",
        };
    }

    async forgetPassword(
        emailOrDto: ForgetPasswordDto | string,
        maybeCode?: string,
        maybeNewPassword?: string
    ) {
        let email: string;
        let code: string;
        let newPassword: string;

        if (typeof emailOrDto === "object") {
            email = emailOrDto.email;
            code = emailOrDto.code || emailOrDto.otp || "";
            newPassword = emailOrDto.newPassword || "";
        } else {
            email = emailOrDto;
            code = maybeCode || "";
            newPassword = maybeNewPassword || "";
        }

        if (!email || !code || !newPassword) {
            throw new AppError("Email, code, and new password are required", 400);
        }

        const user = await this.requireUserByEmail(email);

        await this.validateAndConsumeOtp(email, code);

        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await this.userRepository.updateUserByEmail(email, {
            password: hashedPassword,
        });

        if (!updatedUser) {
            throw new AppError("Failed to update password", 400);
        }

        await this.refreshTokenRepo.revokeAllForUser((updatedUser as any)._id || (updatedUser as any).id);

        return this.toPublicUser(updatedUser);
    }

    async refreshSession(refreshToken: string) {
        let payload: any;

        try {
            payload = this.tokenService.verifyRefresh(refreshToken);
        } catch {
            throw new AppError("Invalid refresh token", 401);
        }

        const tokenHash = this.tokenService.hash(refreshToken);

        const stored = await this.refreshTokenRepo.findByHash(tokenHash);

        if (!stored) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (stored.revokedAt) {
            await this.refreshTokenRepo.revokeFamily(stored.family);

            throw new AppError("Token reuse detected", 401);
        }

        const user = await this.userRepository.findUserById(payload.sub);

        if (!user) {
            throw new AppError("User not found", 401);
        }

        const revoked = await this.refreshTokenRepo.revokeIfActive(stored._id);

        if (!revoked) {
            await this.refreshTokenRepo.revokeFamily(stored.family);

            throw new AppError("Token reuse detected", 401);
        }

        return this.issuePair(user, stored.family);
    }
}

export const authService = new AuthServices();
export const AuthService = authService;
export default authService;
