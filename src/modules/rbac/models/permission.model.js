class Permission {
  constructor({ id, permission_type, module_id, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by }) {
    this.id = id;
    this.permissionType = permission_type;
    this.moduleId = module_id;
    this.createdAt = created_at;
    this.createdBy = created_by;
    this.updatedAt = updated_at;
    this.updatedBy = updated_by;
    this.deletedAt = deleted_at;
    this.deletedBy = deleted_by;
  }
}

export default Permission;
