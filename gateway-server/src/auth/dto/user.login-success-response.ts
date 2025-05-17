class UserLoginSuccessResponse {
  accessToken: string;
  accessTokenExpired: Date;

  constructor(accessToken: string, accessTokenExpired: Date) {
    this.accessToken = accessToken;
    this.accessTokenExpired = accessTokenExpired;
  }
}
