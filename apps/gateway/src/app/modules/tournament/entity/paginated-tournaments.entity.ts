import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { TournamentEntity } from './tournament.entity';

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
export class PaginatedTournamentsEntity {
  @Field(() => [TournamentEntity])
  items!: TournamentEntity[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}
