import { IsNotEmpty, IsString } from 'class-validator';

export class UserCreateRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
