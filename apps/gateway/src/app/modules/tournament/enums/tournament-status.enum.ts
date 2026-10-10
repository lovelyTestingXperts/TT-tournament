import { registerEnumType } from '@nestjs/graphql';

export enum TournamentStatus {
  DRAFT = 'DRAFT',
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(TournamentStatus, {
  name: 'TournamentStatus',
});
