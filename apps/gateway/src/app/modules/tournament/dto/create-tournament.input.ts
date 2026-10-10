import {
  Field,
  InputType,
} from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TournamentFormat } from '../enums/tournament-format.enum';
import { TournamentType } from '../enums/tournament-type.enum';
import { TournamentVisibility } from '../enums/tournament-visibility.enum';
import { StartDateAfterRegistrationDeadline } from './validators/start-after-registration-deadline.validator';

@InputType()
export class CreateTournamentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(3, 120)
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 1024)
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 80)
  category?: string;

  @Field(() => TournamentType)
  @IsEnum(TournamentType)
  type!: TournamentType;

  @Field(() => TournamentFormat)
  @IsEnum(TournamentFormat)
  format!: TournamentFormat;

  @Field(() => TournamentVisibility)
  @IsEnum(TournamentVisibility)
  visibility!: TournamentVisibility;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(2)
  maxPlayers?: number;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  prizePool?: number;

  @Field(() => Date)
  @Type(() => Date)
  @Validate(StartDateAfterRegistrationDeadline)
  startDate!: Date;

  @Field(() => Date)
  @Type(() => Date)
  endDate!: Date;

  @Field(() => Date)
  @Type(() => Date)
  registrationDeadline!: Date;
}
