import {
  Field,
  ObjectType,
} from '@nestjs/graphql';

import { TournamentEntity } from './tournament.entity';
import { PaginationMeta } from '../../../shared/dto/pagination-meta.entity';

@ObjectType()
export class PaginatedTournamentsEntity {
  @Field(() => [TournamentEntity])
  items!: TournamentEntity[];

  @Field(() => PaginationMeta)
  meta!: PaginationMeta;
}
