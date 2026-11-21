import { RefreshToken, RefreshTokenDocument } from "../../../lib/models/refreshToken.model";

export const create = async (data: {
    user: any;
    family: string;
    tokenHash: string;
    expiresAt: Date;
}): Promise<RefreshTokenDocument> => {
    return RefreshToken.create(data);
};

export const findByHash = async (tokenHash: string): Promise<RefreshTokenDocument | null> => {
    return RefreshToken.findOne({ tokenHash });
};

/**
 * Revokes all active refresh tokens belonging to a specific session family.
 *
 * Replay Attack Defense:
 * If an attacker intercepts a previously used refresh token and attempts to replay it,
 * the server recognizes that the token was already revoked. To protect the legitimate user,
 * this function revokes all tokens sharing the same `family` UUID, invalidating the entire stolen session.
 *
 * @param family - The UUID identifying the token family.
 */
export const revokeFamily = async (family: string) => {
    return RefreshToken.updateMany(
        { family, revokedAt: null },
        { revokedAt: new Date() }
    );
};

export const revokeIfActive = async (id: any): Promise<boolean> => {
    const res = await RefreshToken.findOneAndUpdate(
        { _id: id, revokedAt: null },
        { revokedAt: new Date() }
    );
    return res !== null;
};

export const revokeAllForUser = async (user: any) => {
    return RefreshToken.updateMany(
        { user, revokedAt: null },
        { revokedAt: new Date() }
    );
};

export class RefreshTokenRepository {
    create = create;
    findByHash = findByHash;
    revokeFamily = revokeFamily;
    revokeIfActive = revokeIfActive;
    revokeAllForUser = revokeAllForUser;
}

export const refreshTokenRepository = new RefreshTokenRepository();
export default refreshTokenRepository;
