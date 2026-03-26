import rbacService from "../services/rbac.service.js";
import ApiError from "../../../errors/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createRole = async (req, res, next) => {
  try {
    const roleData = req.body;
    const newRole = await rbacService.createRole(roleData);
    res.status(201).json(new ApiResponse(201, newRole, "Role created successfully"));
  } catch (err) {
    next(err);
  }
};

export const getAllRoles = async (_req, res, next) => {
  try {
    const roles = await rbacService.getAllRoles();
    res.status(200).json(new ApiResponse(200, roles, "Roles retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const assignRoleToUser = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const roleId = req.params.roleId || req.body.roleId;
    const result = await rbacService.assignRoleToUser(userId, roleId);
    res.status(200).json(new ApiResponse(200, result, "Role assigned to user successfully"));
  } catch (err) {
    next(err);
  }
};

export const removeRoleFromUser = async (req, res, next) => {
  try {
    const { userId, roleId } = req.params;
    await rbacService.removeRoleFromUser(userId, roleId);
    res.status(200).json(new ApiResponse(200, null, "Role removed from user successfully"));
  } catch (err) {
    next(err);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const roles = await rbacService.getUserRoles(userId);
    res.status(200).json(new ApiResponse(200, roles, "User roles retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const permissionData = req.body;
    const newPermission = await rbacService.createPermission(permissionData);
    res.status(201).json(new ApiResponse(201, newPermission, "Permission created successfully"));
  } catch (err) {
    next(err);
  }
};

export const getAllPermissions = async (_req, res, next) => {
  try {
    const permissions = await rbacService.getAllPermissions();
    res.status(200).json(new ApiResponse(200, permissions, "Permissions retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const assignPermissionToRole = async (req, res, next) => {
  try {
    const roleId = req.params.roleId || req.body.roleId;
    const permissionId = req.params.permissionId || req.body.permissionId;
    const result = await rbacService.assignPermissionToRole(roleId, permissionId);
    res.status(200).json(new ApiResponse(200, result, "Permission assigned to role successfully"));
  } catch (err) {
    next(err);
  }
};

export const getRolePermissions = async (req, res, next) => {
  try {
    const roleId = req.params.roleId || req.body.roleId;
    const permissions = await rbacService.getRolePermissions(roleId);
    res.status(200).json(new ApiResponse(200, permissions, "Role permissions retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const getUserPermissions = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const permissions = await rbacService.getUserPermissions(userId);
    res.status(200).json(new ApiResponse(200, permissions, "User permissions retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const checkUserPermission = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const permission = req.params.permission || req.body.permission;
    const hasPermission = await rbacService.checkUserPermission(userId, permission);
    res.status(200).json(new ApiResponse(200, { hasPermission }, "Permission checked successfully"));
  } catch (err) {
    next(err);
  }
};

export const bootstrapAdmin = async (req, res, next) => {
  try {
    const { email, secret } = req.body;
    if (secret !== process.env.BOOTSTRAP_SECRET) {
      throw new ApiError(403, "Invalid bootstrap secret");
    }
    const result = await rbacService.bootstrapAdmin(email);
    res.status(200).json(new ApiResponse(200, result, "Admin bootstrapped successfully"));
  } catch (err) {
    next(err);
  }
};
