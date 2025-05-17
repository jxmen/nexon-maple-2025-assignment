import { RpcException } from '@nestjs/microservices';

export class LoginFailedException extends RpcException {
  constructor() {
    super('로그인에 실패하였습니다.');
  }
}
