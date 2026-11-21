/**
 * JWT TOKEN GENERATOR UTILITY
 *
 * Responsibility:
 * Generates signed JSON Web Tokens (JWT) for user authentication sessions.
 *
 * Why does this file exist?
 * To provide a lightweight, reusable helper function that signs user claims with the
 * application's private JWT secret and sets a default expiration time (1 hour).
 *
 * How JWT Works:
 * A JWT consists of three Base64URL-encoded parts separated by dots:
 * `header.payload.signature`
 * 1. **Header**: Contains metadata about the token algorithm (HMAC SHA-256).
 * 2. **Payload**: Contains the claims (e.g. `sub: userId`, `email`, `role`).
 * 3. **Signature**: Computed using the secret key (`HMACSHA256(base64Url(header) + "." + base64Url(payload), secret)`).
 *    Because only the backend server knows the `JWT_SECRET`, any tampering with the payload
 *    invalidates the signature immediately.
 *
 * Architecture:
 * Utilities / Security Layer.
 *
 * Dependencies:
 * - `jsonwebtoken`: Standard library for signing and verifying JWTs.
 * - `config.jwt.secret`: The secret key loaded from environment variables.
 * - `IUser`: Domain user interface to type user claims.
 *
 * Used by:
 * - Authentication workflows and tests requiring quick session token generation.
 * - Complements `TokenService` (`src/app/auth/service/token.service.ts`), which handles dual access/refresh tokens.
 */

// Import JWT signing function and payload types
import jwt, { JwtPayload } from "jsonwebtoken";

// Import application configuration containing the environment secret
import { config } from "../config/env";

// Import the user interface to ensure type safety on injected claims
import { IUser } from "../interface/UserInterface";

/**
 * Signs and generates a JSON Web Token string with a 1-hour expiration window.
 *
 * @param payload - Object containing JWT claims and user properties (e.g., id, email, role).
 * @returns A signed JWT string in `header.payload.signature` format.
 *
 * @example
 * const token = generateToken({ sub: user._id.toString(), email: user.email, role: "user" });
 */
export const generateToken = (payload: JwtPayload & Partial<IUser>): string => {
    // Signs the payload using HMAC SHA-256 with the secret key from environment configuration
    return jwt.sign(payload, config.jwt.secret, { expiresIn: "1h" });
};

export default generateToken;
