import { registerEnumType } from '@nestjs/graphql';

export enum TournamentSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(TournamentSortOrder, {
  name: 'TournamentSortOrder',
});
