import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersInput } from './dto/users.input';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './user.service';
import { PaginatedUsersEntity } from './entity/pagingated-users.entity';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => UserEntity, {
    name: 'createUser',
  })
  async createUser(
    @Args('input')
    input: CreateUserInput,
  ): Promise<UserEntity> {
    return this.usersService.create(input) as any;
  }

  @Query(() => PaginatedUsersEntity, {
    name: 'users',
  })
  async users(
    @Args('input', {
      nullable: true,
    })
    input?: UsersInput,
  ): Promise<PaginatedUsersEntity> {
    return this.usersService.findAll(
      input ?? new UsersInput(),
    );
  }

  @Query(() => UserEntity, {
    name: 'user',
  })
  async user(
    @Args('id')
    id: string,
  ): Promise<UserEntity> {
    return this.usersService.findById(id) as any;
  }

  @Mutation(() => UserEntity, {
    name: 'updateUser',
  })
  async updateUser(
    @Args('id')
    id: string,

    @Args('input')
    input: UpdateUserInput,
  ): Promise<UserEntity> {
    return this.usersService.update(
      id,
      input,
    ) as any;
  }

  @Mutation(() => Boolean, {
    name: 'deleteUser',
  })
  async deleteUser(
    @Args('id')
    id: string,
  ): Promise<boolean> {
    return this.usersService.softDelete(id);
  }

  @Mutation(() => Boolean, {
    name: 'restoreUser',
  })
  async restoreUser(
    @Args('id')
    id: string,
  ): Promise<boolean> {
    return this.usersService.restoreUser(id);
  }
}
