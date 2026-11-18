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

