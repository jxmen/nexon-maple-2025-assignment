import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserFinder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ id }).exec();
  }
}
