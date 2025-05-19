import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordEncoder } from '../password-encoder';

@Injectable()
export class BcryptPasswordEncoder implements PasswordEncoder {
  private static readonly SALT_ROUNDS = 10;

  verify(rawPassword: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, userPassword);
  }

  encode(password: string): string {
    return bcrypt.hashSync(password, BcryptPasswordEncoder.SALT_ROUNDS);
  }
}
