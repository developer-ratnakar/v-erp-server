export class LoginResponseDTO {
  constructor({ id, email, firstName, lastName, accessToken }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accessToken = accessToken;
  }
}