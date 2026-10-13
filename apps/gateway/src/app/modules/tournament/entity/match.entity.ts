import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MatchStatus } from '../schemas/match.schema';

registerEnumType(MatchStatus, {
  name: 'MatchStatus',
  description: 'Operational status of a tournament match',
});

@ObjectType()
export class MatchEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  tournamentId!: string;

  @Field()
  tournamentName!: string;

  @Field(() => Int)
  round!: number;

  @Field()
  roundName!: string;

  @Field(() => Int)
  matchNumber!: number;

  @Field(() => String, { nullable: true })
  playerAId?: string | null;

  @Field()
  playerAName!: string;

  @Field(() => String, { nullable: true })
  playerBId?: string | null;

  @Field()
  playerBName!: string;

  @Field(() => String, { nullable: true })
  teamAId?: string | null;

  @Field(() => String, { nullable: true })
  teamAName?: string | null;

  @Field(() => String, { nullable: true })
  teamBId?: string | null;

  @Field(() => String, { nullable: true })
  teamBName?: string | null;

  @Field(() => Int)
  scoreA!: number;

  @Field(() => Int)
  scoreB!: number;

  @Field(() => String, { nullable: true })
  scoreDetails?: string | null;

  @Field(() => String, { nullable: true })
  winnerId?: string | null;

  @Field(() => String, { nullable: true })
  winnerName?: string | null;

  @Field(() => MatchStatus)
  status!: MatchStatus;

  @Field(() => Int, { defaultValue: 1 })
  wave!: number;

  @Field()
  isFinal!: boolean;

  @Field()
  isBye!: boolean;

  @Field()
  scheduledAt!: Date;

  @Field(() => Date, { nullable: true })
  completedAt?: Date | null;
}

@ObjectType()
export class ParticipantDetailEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;
}
