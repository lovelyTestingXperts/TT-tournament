import { registerEnumType } from '@nestjs/graphql';

export enum TournamentFormat {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  ROUND_ROBIN = 'ROUND_ROBIN',
  LEAGUE = 'LEAGUE',
}

registerEnumType(TournamentFormat, {
  name: 'TournamentFormat',
});
