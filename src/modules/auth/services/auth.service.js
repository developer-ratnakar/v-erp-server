import authRepository from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError.js";
import User from "../models/user.model.js";

class AuthService {
  async login(dto) {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid Credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.accessToken = token;

    const sessionData = {
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 3600000), // 1 hour from now
    };

    await authRepository.createLoginSession(sessionData);

    return user;
  }

  async register(dto) {
    const existingUser = await authRepository.findUserByEmail(dto.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const newUser = new User({
      ...dto,
      password: hashedPassword
    });

    return await authRepository.createUser(newUser);
  }
}

export default new AuthService();
