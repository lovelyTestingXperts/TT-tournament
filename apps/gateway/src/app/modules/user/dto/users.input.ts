import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';

import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { SortOrder } from '../enums/sort-order.enum';
import { UserSortField } from '../enums/user-sort-field.enum';
import { UserRole } from '../../../shared/enums/user-role.enum';

@InputType()
export class UsersInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  @Min(1)
  page?: number = 1;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  @Min(1)
  limit?: number = 10;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  search?: string;

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

  @Field(() => UserSortField, {
    nullable: true,
    defaultValue: UserSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(UserSortField)
  sortBy?: UserSortField = UserSortField.CREATED_AT;

  @Field(() => SortOrder, {
    nullable: true,
    defaultValue: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}