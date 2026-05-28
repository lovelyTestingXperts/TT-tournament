import {
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { UserRole } from '../../../shared/enums/user-role.enum';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class UserEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  fullName!: string;

  @Field()
  email!: string;
  
  @Field()
  employeeId!: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  isEmailVerified!: boolean;

  @Field()
  isActive!: boolean;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  lastLoginAt?: Date;

  @Field({ nullable: true })
  emailVerifiedAt?: Date;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}