import {
  Field,
  InputType,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TournamentFormat } from '../enums/tournament-format.enum';
import { TournamentType } from '../enums/tournament-type.enum';
import { TournamentVisibility } from '../enums/tournament-visibility.enum';
import { TournamentStatus } from '../enums/tournament-status.enum';

@InputType()
export class UpdateTournamentInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(3, 120)
  name?: string;

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

  @Field(() => TournamentType, { nullable: true })
  @IsEnum(TournamentType)
  @IsOptional()
  type?: TournamentType;

  @Field(() => TournamentFormat, { nullable: true })
  @IsEnum(TournamentFormat)
  @IsOptional()
  format?: TournamentFormat;

  @Field(() => TournamentVisibility, { nullable: true })
  @IsEnum(TournamentVisibility)
  @IsOptional()
  visibility?: TournamentVisibility;

  @Field(() => TournamentStatus, { nullable: true })
  @IsEnum(TournamentStatus)
  @IsOptional()
  status?: TournamentStatus;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  hasBothDivisions?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  division?: string;


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

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  registrationDeadline?: Date;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
