import {
  Field,
  ObjectType,
} from '@nestjs/graphql';

import { UserEntity } from './user.entity';
import { PaginationMeta } from '../../../shared/dto/pagination-meta.entity';

@ObjectType()
export class PaginatedUsersEntity {
  @Field(() => [UserEntity])
  items!: UserEntity[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}