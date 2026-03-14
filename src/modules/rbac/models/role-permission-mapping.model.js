class RolePermissionMapping {
  constructor({ role_id, permission_id, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by }) {
    this.roleId = role_id;
    this.permissionId = permission_id;
    this.createdAt = created_at;
    this.createdBy = created_by;
    this.updatedAt = updated_at;
    this.updatedBy = updated_by;
    this.deletedAt = deleted_at;
    this.deletedBy = deleted_by;
  }
}

export default RolePermissionMapping;
