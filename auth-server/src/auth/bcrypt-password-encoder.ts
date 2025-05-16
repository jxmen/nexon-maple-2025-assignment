import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordEncoder } from '../users/password-encoder';

@Injectable()
export class BcryptPasswordEncoder implements PasswordEncoder {
  encode(password: string): string {
    const saltRounds = 10;

    return bcrypt.hashSync(password, saltRounds);
  }
}
