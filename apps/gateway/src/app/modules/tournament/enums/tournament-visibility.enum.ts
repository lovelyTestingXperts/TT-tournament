import { registerEnumType } from '@nestjs/graphql';

export enum TournamentVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(TournamentVisibility, {
  name: 'TournamentVisibility',
});
