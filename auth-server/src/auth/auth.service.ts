import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserFinder } from '../user/user.finder';
import { PasswordEncoder } from '../password-encoder';
import { AlreadyExistUserCannotSignupException } from '../common/exceptions/already-exist-user-cannot-signup-exception';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userFinder: UserFinder,
    @Inject('PasswordEncoder')
    private readonly passwordEncoder: PasswordEncoder,
    private readonly userService: UserService,
  ) {}

  async signUp(id: string, password: string) {
    await this.validateNotExistById(id);

    const user = User.signUp(id, password, this.passwordEncoder);

    await this.userService.save(user);
    this.logger.debug(`id '${id}' 회원가입(유저 등록) 완료`);
  }

  /**
   * 유저가 식별자를 통해 존재하지 않는지 검증
   *
   * @param id 유저 식별자
   * @private
   */
  private async validateNotExistById(id: string) {
    const user = await this.userFinder.findById(id);
    if (user != null) {
      throw new AlreadyExistUserCannotSignupException(id);
    }
  }
}
