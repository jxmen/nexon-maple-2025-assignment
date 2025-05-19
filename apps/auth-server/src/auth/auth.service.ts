import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserFinder } from '../user/user.finder';
import { PasswordEncoder } from '../password-encoder';
import { AlreadyExistUserCannotSignupException } from '../common/exceptions/already-exist-user-cannot-signup-exception';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { LoginFailedException } from '../common/exceptions/login-failed-exception';
import { TokenGenerator } from '../token-generator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userFinder: UserFinder,
    private readonly userService: UserService,
    @Inject('PasswordEncoder')
    private readonly passwordEncoder: PasswordEncoder,
    @Inject('TokenGenerator')
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async signUp(id: string, password: string) {
    await this.validateNotExistById(id);

    const user = User.signUp(id, password, this.passwordEncoder);

    await this.userService.save(user);
    this.logger.debug(`id '${id}' 회원가입(유저 등록) 완료`);
  }

  /**
   * 로그인
   */
  async signIn(id: string, password: string) {
    const user = await this.validateExistById(id);
    await this.verifyPasswordMatch(user, password);

    const tokenInfo = this.tokenGenerator.generate(user);

    return {
      ...tokenInfo,
    };
  }

  /**
   * 유저 식별자를 통해 유저가 존재하는지 검증합니다. 없을 경우 예외 발생, 있을 경우 찾은 유저를 리턴합니다.
   * @param id 유저 식별자
   * @return 식별자를 통해 찾은 유저
   * @private
   */
  private async validateExistById(id: string) {
    const user = await this.userFinder.findById(id);
    if (!user) {
      this.logger.debug(`id '${id}'에 대한 유저가 존재하지 않음`);
      throw new LoginFailedException();
    }

    return user;
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

  private async verifyPasswordMatch(user: User, password: string) {
    const matched = await this.passwordEncoder.verify(password, user.password);
    if (!matched) {
      this.logger.debug(`비밀번호 불일치. id: ${user.id}`);
      throw new LoginFailedException();
    }
  }
}
