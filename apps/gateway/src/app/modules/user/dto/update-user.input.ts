import {
  Field,
  InputType,
} from '@nestjs/graphql';

import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { UserRole } from '../../../shared/enums/user-role.enum';

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

  @Field(() => UserRole, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => Boolean, {
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
