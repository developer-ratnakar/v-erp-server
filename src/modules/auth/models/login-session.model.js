class LoginSession {
  constructor({ id, user_id, token, expires_at, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by }) {
    this.id = id;
    this.userId = user_id;
    this.token = token;
    this.expiresAt = expires_at;
    this.createdAt = created_at;
    this.createdBy = created_by;
    this.updatedAt = updated_at;
    this.updatedBy = updated_by;
    this.deletedAt = deleted_at;
    this.deletedBy = deleted_by;
  }
}

export default LoginSession;
