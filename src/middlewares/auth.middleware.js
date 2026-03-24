import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";
import authRepository from "../modules/auth/repositories/auth.repository.js";
import rbacService from "../modules/rbac/services/rbac.service.js";

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    const userId = payload.userId || payload.id;
    
    if (!userId) {
      throw new ApiError(401, "Invalid token payload format");
    }

    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    req.auth = {
      token,
      userId: user.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission = (permission) => async (req, _res, next) => {
  try {
    if (!req.user?.id) {
      throw new ApiError(401, "Authentication required");
    }

    const hasPermission = await rbacService.checkUserPermission(req.user.id, permission);

    if (!hasPermission) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
};
