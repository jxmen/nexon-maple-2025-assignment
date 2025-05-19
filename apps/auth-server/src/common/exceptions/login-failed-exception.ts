import { RpcException } from '@nestjs/microservices';

export class LoginFailedException extends RpcException {
  constructor() {
    super({
      code: 'LOGIN_FAILED',
      message: '로그인에 실패하였습니다.',
    });
  }
}
