import { registerEnumType } from '@nestjs/graphql';

export enum TournamentSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  START_DATE = 'startDate',
  PRIZE_POOL = 'prizePool',
}

registerEnumType(TournamentSortField, {
  name: 'TournamentSortField',
});
