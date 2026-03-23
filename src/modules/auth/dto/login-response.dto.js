export class LoginResponseDTO {
  constructor({ id, email, firstName, lastName, accessToken, refreshToken, roles, permissions }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.roles = roles || [];
    this.permissions = permissions || [];
  }
}