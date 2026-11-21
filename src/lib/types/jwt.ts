/**
 * JSONWEBTOKEN MODULE DECLARATION AUGMENTATION
 *
 * Responsibility:
 * Extends the external `jsonwebtoken` library's type definitions with application-specific claims.
 *
 * Why does this file exist?
 * By default, third-party libraries like `jsonwebtoken` define generic types (such as `JwtPayload`
 * being a generic object `{ [key: string]: any; sub?: string }`).
 * TypeScript allows developers to augment ambient modules using `declare module "<package-name>"`.
 * This file adds strong typing for our custom claims (`email`, `role`, `sub`), ensuring that
 * when JWT payloads are manipulated or signed in token services, TypeScript checks and autocompletes
 * these fields accurately.
 *
 * Architecture:
 * Core Types / Ambient Declaration Layer.
 *
 * Dependencies:
 * - `jsonwebtoken`: The official JWT npm package.
 *
 * Used by:
 * - `src/app/auth/service/token.service.ts`: For typed JWT payload creation and verification.
 * - `src/lib/types/index.ts`: Re-exported globally.
 */

// Declare module augmentation on the external "jsonwebtoken" package
declare module "jsonwebtoken" {
    /**
     * Custom payload interface defining the standard claims included in our issued JWTs.
     */
    interface payload {
        /** Subject identifier: the user's unique MongoDB ObjectId string */
        sub: string;

        /** The user's account email address */
        email: string;

        /** The user's role (e.g. 'user' or 'admin') for RBAC authorization checks */
        role: string;
    }
}
