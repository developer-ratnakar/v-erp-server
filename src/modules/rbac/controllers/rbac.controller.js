import rbacService from "../services/rbac.service.js";

export const createRole = async (req, res, next) => {
  try {
    const roleData = req.body;
    const newRole = await rbacService.createRole(roleData);
    res.status(201).json(newRole);
  } catch (err) {
    next(err);
  }
};

export const getAllRoles = async (_req, res, next) => {
  try {
    const roles = await rbacService.getAllRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

export const assignRoleToUser = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const roleId = req.params.roleId || req.body.roleId;
    const result = await rbacService.assignRoleToUser(userId, roleId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserRoles = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const roles = await rbacService.getUserRoles(userId);
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const permissionData = req.body;
    const newPermission = await rbacService.createPermission(permissionData);
    res.status(201).json(newPermission);
  } catch (err) {
    next(err);
  }
};

export const getAllPermissions = async (_req, res, next) => {
  try {
    const permissions = await rbacService.getAllPermissions();
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

export const assignPermissionToRole = async (req, res, next) => {
  try {
    const roleId = req.params.roleId || req.body.roleId;
    const permissionId = req.params.permissionId || req.body.permissionId;
    const result = await rbacService.assignPermissionToRole(roleId, permissionId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getRolePermissions = async (req, res, next) => {
  try {
    const roleId = req.params.roleId || req.body.roleId;
    const permissions = await rbacService.getRolePermissions(roleId);
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

export const getUserPermissions = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const permissions = await rbacService.getUserPermissions(userId);
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

export const checkUserPermission = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    const permission = req.params.permission || req.body.permission;
    const hasPermission = await rbacService.checkUserPermission(userId, permission);
    res.status(200).json({ hasPermission });
  } catch (err) {
    next(err);
  }
};
