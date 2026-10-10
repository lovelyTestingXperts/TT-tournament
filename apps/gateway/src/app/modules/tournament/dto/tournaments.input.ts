import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TournamentStatus } from '../enums/tournament-status.enum';
import { TournamentType } from '../enums/tournament-type.enum';
import { TournamentVisibility } from '../enums/tournament-visibility.enum';
import { TournamentSortField } from '../enums/tournament-sort-field.enum';
import { TournamentSortOrder } from '../enums/tournament-sort-order.enum';

@InputType()
export class TournamentsInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field(() => TournamentStatus, { nullable: true })
  @IsEnum(TournamentStatus)
  @IsOptional()
  status?: TournamentStatus;

  @Field(() => TournamentType, { nullable: true })
  @IsEnum(TournamentType)
  @IsOptional()
  type?: TournamentType;

  @Field(() => TournamentVisibility, { nullable: true })
  @IsEnum(TournamentVisibility)
  @IsOptional()
  visibility?: TournamentVisibility;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  startDateFrom?: Date;

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  startDateTo?: Date;

  @Field(() => TournamentSortField, { nullable: true })
  @IsEnum(TournamentSortField)
  @IsOptional()
  sortBy?: TournamentSortField;

  @Field(() => TournamentSortOrder, { nullable: true })
  @IsEnum(TournamentSortOrder)
  @IsOptional()
  sortOrder?: TournamentSortOrder;
}
