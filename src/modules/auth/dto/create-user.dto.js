export class CreateUserDTO {
  constructor({ firstName, middleName, lastName, email, password }) {
    this.firstName = firstName;
    this.middleName = middleName ?? null;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
