import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { TournamentFormat } from '../enums/tournament-format.enum';
import { TournamentStatus } from '../enums/tournament-status.enum';
import { TournamentType } from '../enums/tournament-type.enum';
import { TournamentVisibility } from '../enums/tournament-visibility.enum';
import { MatchEntity, ParticipantDetailEntity } from './match.entity';

@ObjectType()
export class TeamMemberEntity {
  @Field(() => ID)
  userId!: string;

  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field({ defaultValue: 'PLAYER' })
  roleInTeam!: string;
}

@ObjectType()
export class TeamEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => ID)
  captainId!: string;

  @Field()
  captainName!: string;

  @Field(() => [TeamMemberEntity])
  members!: TeamMemberEntity[];
}

@ObjectType()
export class TournamentEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  sport?: string | null;

  @Field(() => String, { defaultValue: 'INDIVIDUAL' })
  competitionType!: string;

  @Field(() => String, { nullable: true })
  scoringFormat?: string | null;

  @Field(() => Int, { nullable: true })
  minTeamSize?: number | null;

  @Field(() => Int, { nullable: true })
  maxTeamSize?: number | null;

  @Field(() => [TeamEntity], { nullable: true })
  teams?: TeamEntity[];

  @Field(() => Boolean, { defaultValue: false })
  isRegistrationClosed!: boolean;

  @Field(() => Int, { defaultValue: 1 })
  currentWave!: number;

  @Field(() => TournamentType)
  type!: TournamentType;

  @Field(() => TournamentFormat)
  format!: TournamentFormat;

  @Field(() => TournamentVisibility)
  visibility!: TournamentVisibility;

  @Field({ nullable: true })
  bannerImage?: string;

  @Field(() => Int, { nullable: true })
  maxPlayers?: number;

  @Field(() => Int, { nullable: true })
  prizePool?: number;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  registrationDeadline!: Date;

  @Field()
  createdBy!: string;

  @Field(() => [String])
  participants!: string[];

  @Field(() => [ParticipantDetailEntity], { nullable: true })
  participantDetails?: ParticipantDetailEntity[];

  @Field(() => [String])
  matches!: string[];

  @Field(() => [MatchEntity], { nullable: true })
  matchDetails?: MatchEntity[];

  @Field(() => TournamentStatus)
  status!: TournamentStatus;

  @Field(() => String, { nullable: true })
  winnerId?: string | null;

  @Field(() => String, { nullable: true })
  winnerName?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  isDeleted!: boolean;

  @Field({ nullable: true })
  deletedAt?: Date;
}
