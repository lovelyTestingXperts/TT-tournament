import { registerEnumType } from '@nestjs/graphql';

export enum TournamentType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

registerEnumType(TournamentType, {
  name: 'TournamentType',
});
