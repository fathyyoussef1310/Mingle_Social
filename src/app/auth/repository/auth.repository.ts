
import { UserRepository, userRepository } from "../../user/repository/user.repository";

export class AuthRepository extends UserRepository {}

export const authRepository = new AuthRepository();
export default authRepository;
