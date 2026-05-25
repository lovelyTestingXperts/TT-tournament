import { Injectable } from '@nestjs/common';

import { RegisterInput } from './dto/register.input';
import { UsersService } from '../user/user.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async register(
    registerInput: RegisterInput,
  ) {
    const user =
      await this.usersService.create(
        registerInput,
      );

    return user;
  }
}