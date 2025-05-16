export class UserCreateRequest {
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  name: string;
  password: string;
}
