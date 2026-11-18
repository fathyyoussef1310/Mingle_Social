import { Otp, OtpDocument } from "../../../lib/models/otp.model";


export class OtpRepository {
    
 getOtpByEmail = async (email: string): Promise<OtpDocument | null> => {
    return Otp.findOne({ email });
};

 createOtp = async (email: string, code: string, expiredAt: Date): Promise<OtpDocument> => {
    return Otp.create({ email, code, expiredAt });
};

  deleteOtp = async (email: string) => {
    return Otp.deleteMany({ email });
};
}

export const otpRepository = new OtpRepository();
export default otpRepository;

