/**
 * OTP GENERATOR UTILITY
 *
 * Responsibility:
 * Generates pseudo-random 6-digit numeric verification codes for user email verification and resets.
 *
 * Why does this file exist?
 * When a user registers or requests password recovery, the system must generate a temporary,
 * easy-to-type one-time code (OTP) and email it to the user.
 *
 * How the Math Works:
 * - `Math.random()` generates a floating-point number in the range \([0, 1)\).
 * - Multiplying by 900,000 gives a range of \([0, 899999.999...)\).
 * - Adding 100,000 shifts the range to \([100000, 999999.999...)\).
 * - `Math.floor()` rounds down to the nearest integer, strictly guaranteeing an integer between 100,000 and 999,999.
 * - `.toString()` converts the number into a 6-character string.
 *
 * Architecture:
 * Utilities Layer.
 *
 * Dependencies:
 * None (pure JavaScript standard library).
 *
 * Used by:
 * - `src/app/auth/service/auth.service.ts`: Generates OTPs when registering users (`registerUser`).
 */

/**
 * Generates a random 6-digit numerical string between "100000" and "999999".
 *
 * @returns A 6-character string representing the one-time verification password.
 *
 * @example
 * const otp = generateOtpEmail(); // "481920"
 */
export const generateOtpEmail = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default generateOtpEmail;
