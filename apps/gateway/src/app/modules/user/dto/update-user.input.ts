import {
  Field,
  InputType,
} from '@nestjs/graphql';

import {
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}