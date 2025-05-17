import { RpcException } from '@nestjs/microservices';

export class AlreadyExistUserCannotSignupException extends RpcException {
  constructor(id: string) {
    super({
      code: 'ALREADY_EXIST_USER_CANNOT_SIGNUP',
      message: `아이디 '${id}'는 이미 존재하여 회원가입을 진행할 수 없습니다.`,
    });
  }
}
