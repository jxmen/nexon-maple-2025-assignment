export default class UserCreateRequest {
  constructor(id: string, password: string) {
    this.id = id;
    this.password = password;
  }

  id: string;
  password: string;
}
