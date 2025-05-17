export interface PasswordEncoder {
  encode(password: string): string;

  verify(rawPassword: string, userPassword: string): Promise<boolean>;
}
