import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptPasswordEncoder } from './bcrypt-password-encoder';
import { UserFinder } from '../user/user.finder';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'PasswordEncoder',
      useClass: BcryptPasswordEncoder,
    },
    UserFinder,
    UserService,
  ],
  exports: ['PasswordEncoder'],
})
export class AuthModule {}
