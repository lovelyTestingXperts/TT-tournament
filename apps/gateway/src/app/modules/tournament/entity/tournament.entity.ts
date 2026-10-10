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

  @Field(() => [String])
  matches!: string[];

  @Field(() => TournamentStatus)
  status!: TournamentStatus;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  isDeleted!: boolean;

  @Field({ nullable: true })
  deletedAt?: Date;
}
