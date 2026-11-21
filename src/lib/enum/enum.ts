/**
 * APPLICATION DOMAIN ENUMS
 *
 * Responsibility:
 * Defines fixed, strongly-typed enumerations for domain categories used across models and DTOs.
 *
 * Why does this file exist?
 * To avoid "magic numbers" and "magic strings" in the codebase.
 * Instead of checking `if (user.provider === 0)` or `if (user.gender === "boy")`, using TypeScript
 * enums guarantees that only valid, recognized values are assigned at compile time, eliminating
 * subtle spelling and casing bugs.
 *
 * Architecture:
 * Domain / Shared Types Layer.
 *
 * Used by:
 * - `src/lib/interface/UserInterface.ts`: To type `provider` and `gender`.
 * - `src/lib/models/user.model.ts`: In Mongoose enum schema validators.
 * - `src/app/auth/dto/dto.ts`: In registration payload validation.
 */

/**
 * Authentication Provider Enum
 *
 * Identifies the authority that authenticated the user account:
 * - `LOCAL`: Standard email and password stored in MongoDB.
 * - `GOOGLE`: Authenticated via Google OAuth2 ID tokens.
 * - `FACEBOOK`: Authenticated via Facebook OAuth (reserved for Phase 2).
 */
enum Provider {
    LOCAL,
    GOOGLE,
    FACEBOOK
}

/**
 * Gender Classification Enum
 *
 * Used for user profile demographics.
 */
enum Gender {
    BOY = "BOY",
    GIRL = "GIRL"
}

// Export enums for use across the application
export {
    Provider,
    Gender
};
