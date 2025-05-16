import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async save(user: User) {
    const created = new this.userModel({
      id: user.id,
      password: user.password,
      role: user.role,
    });
    await created.save();
  }
}
