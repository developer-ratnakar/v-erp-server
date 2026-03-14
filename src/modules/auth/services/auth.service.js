import authRepository from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

class AuthService {
  async login(dto) {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.accessToken = token;

    const sessionData = {
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 3600000), // 1 hour from now
    }

    await authRepository.createLoginSession(sessionData);

    return user;
  }

  async register(dto) {
    const user = await authRepository.findUserByEmail(dto.email);

    if (user) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashedPassword;

    return await authRepository.createUser(dto);
  }
}

export default new AuthService();
