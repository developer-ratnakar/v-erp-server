import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";
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

    req.user = { id: userId, email: payload.email, roles: payload.roles || [] };
    req.auth = {
      token,
      userId,
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
