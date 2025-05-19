import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequest {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
