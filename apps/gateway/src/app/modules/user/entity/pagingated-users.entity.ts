import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { UserEntity } from './user.entity';

@ObjectType()
class PaginationMeta {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class PaginatedUsersEntity {
  @Field(() => [UserEntity])
  items!: UserEntity[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}