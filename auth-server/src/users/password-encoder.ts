export interface PasswordEncoder {
  encode(password: string): string;
}
