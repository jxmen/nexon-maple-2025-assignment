import { BadRequestException } from '@nestjs/common';

export class AlreadyExistUserCannotSignupException extends BadRequestException {
  constructor(id: string) {
    super(`아이디 '${id}'는 이미 존재하여 회원가입을 진행할 수 없습니다.`);
  }
}
