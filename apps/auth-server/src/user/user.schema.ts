import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { PasswordEncoder } from '../password-encoder';

@Schema({ timestamps: true, collection: 'user' })
export class User {
  constructor(id: string, password: string, role: string) {
    this.id = id;
    this.password = password;
    this.role = role;
  }

  /**
   * 유저 등록(회원가입)
   * @param id 아이디
   * @param password 패스워드(암호화되지 않은)
   * @param passwordEncoder 패스워드 암호화
   */
  public static signUp = (
    id: string,
    password: string,
    passwordEncoder: PasswordEncoder,
  ): User => {
    return new User(id, passwordEncoder.encode(password), 'user');
  };

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
