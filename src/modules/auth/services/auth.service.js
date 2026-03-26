import authRepository from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ApiError from "../../../errors/ApiError.js";
import User from "../models/user.model.js";

// One-way deterministic hash for token storage — SHA-256 keeps lookups fast
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Token expiry constants
const ACCESS_TOKEN_EXPIRY = "15m";           // 15 minutes
const REFRESH_TOKEN_EXPIRY = "24h";          // 24 hours
const REFRESH_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

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

    const [roles, permissions] = await Promise.all([
      authRepository.getUserRoles(user.id),
      authRepository.getUserRoles(user.id).then(async (userRoles) => {
        const perms = await Promise.all(
          userRoles.map((role) => authRepository.getRolePermissions(role.id))
        );
        return perms.flat();
      }),
    ]);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    user.roles = roles.map((r) => r.roleName);
    user.permissions = permissions;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const sessionData = {
      user_id: user.id,
      token: hashToken(accessToken),               // store hashed — never raw JWT in DB
      refresh_token: hashToken(refreshToken),       // store hashed — never raw JWT in DB
      expires_at: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    };

    await authRepository.createLoginSession(sessionData);

    return user;
  }

  async refreshToken(refreshTokenStr) {
    // 1. Verify the refresh token signature & expiry
    let payload;
    try {
      payload = jwt.verify(refreshTokenStr, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // 2. Hash incoming token and look it up in DB (not already rotated away)
    const session = await authRepository.findSessionByRefreshToken(hashToken(refreshTokenStr));
    if (!session) {
      throw new ApiError(401, "Refresh token not found or already used");
    }

    // 3. Double-check DB expiry
    if (new Date(session.expiresAt) < new Date()) {
      throw new ApiError(401, "Refresh token has expired");
    }

    // 4. Generate new token pair
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    // 5. Rotate: store hashed new refresh token (invalidates the old hash)
    await authRepository.updateSessionRefreshToken(session.id, hashToken(newRefreshToken), newExpiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async register(dto) {
    const existingUser = await authRepository.findUserByEmail(dto.email);

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new User({
      ...dto,
      password: hashedPassword,
    });

    return await authRepository.createUser(newUser);
  }

  async getAllUsers() {
    return await authRepository.getAllUsers();
  }

  async deleteUser(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return await authRepository.deleteUser(userId);
  }

  async changeUserPassword(userId, newPassword) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await authRepository.changeUserPassword(userId, hashedPassword);
  }
}

export default new AuthService();
