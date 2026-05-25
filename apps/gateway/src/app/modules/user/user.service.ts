import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

import { RegisterInput } from '../auth/dto/register.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(
    registerInput: RegisterInput,
  ): Promise<User> {
    const existingUser =
      await this.userModel.findOne({
        email: registerInput.email,
      });

    if (existingUser) {
      throw new ConflictException(
        'User already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerInput.password,
        10,
      );

    const user =
      await this.userModel.create({
        ...registerInput,
        password: hashedPassword,
      });

    return user;
  }
}