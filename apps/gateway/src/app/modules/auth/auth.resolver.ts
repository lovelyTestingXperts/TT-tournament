import {
  Args,
  Mutation,
  Resolver,
} from '@nestjs/graphql';

import { AuthService } from './auth.service';

import { RegisterInput } from './dto/register.input';
import { UserEntity } from '../user/entity/user.entity';


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserEntity)
  async register(
    @Args('input')
    input: RegisterInput,
  ) {
    return this.authService.register(
      input,
    );
  }
}