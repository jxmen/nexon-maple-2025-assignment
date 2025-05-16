import { Inject, Injectable } from '@nestjs/common';
import { UserFinder } from '../user/user.finder';
import { PasswordEncoder } from '../password-encoder';
import { AlreadyExistUserCannotSignupException } from '../common/exceptions/already-exist-user-cannot-signup-exception';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userFinder: UserFinder,
    @Inject('PasswordEncoder')
    private readonly passwordEncoder: PasswordEncoder,
    private readonly userService: UserService,
  ) {}

  async signUp(id: string, password: string) {
    const isExist = (await this.userFinder.findById(id)) != null;
    if (isExist) {
      throw new AlreadyExistUserCannotSignupException(id);
    }

    const user = User.signUp(id, password, this.passwordEncoder);

    await this.userService.save(user);
  }
}
