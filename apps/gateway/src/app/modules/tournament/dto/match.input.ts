import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class RecordMatchResultInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  matchId!: string;

  @Field(() => Int)
  @IsInt()
  @Min(0, { message: 'Score cannot be negative' })
  scoreA!: number;

  @Field(() => Int)
  @IsInt()
  @Min(0, { message: 'Score cannot be negative' })
  scoreB!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  scoreDetails?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  winnerId?: string;
}

@InputType()
export class RegisterTeamMemberInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roleInTeam?: string;
}

@InputType()
export class RegisterTeamInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  captainId!: string;

  @Field(() => [RegisterTeamMemberInput])
  members!: RegisterTeamMemberInput[];
}

@InputType()
export class CreateCustomMatchInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  tournamentId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  playerAId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  playerBId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roundName?: string;
}

@InputType()
export class MatchesFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tournamentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
