import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UserEntity } from '../user/entity/user.entity';
import { AuthPayload } from './entity/auth-payload.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { CurrentUserPayload } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserEntity, {
    description: 'Public self-registration (locked strictly to PLAYER role)',
  })
  async register(
    @Args('input')
    input: RegisterInput,
  ): Promise<UserEntity> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload, {
    description: 'Authenticate user with email and password to receive JWT accessToken',
  })
  async login(
    @Args('input')
    input: LoginInput,
  ): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  @Query(() => UserEntity, {
    description: 'Get current authenticated user profile',
  })
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<UserEntity> {
    return this.authService.validateUserById(currentUser.userId);
  }
}