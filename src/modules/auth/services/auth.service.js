import authRepository from "../repositories/auth.repository.js";

class AuthService {
  async login(dto) {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    return user;
  }
}

export default new AuthService();
