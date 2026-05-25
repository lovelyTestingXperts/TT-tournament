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
  fullName!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => UserRole)
    role: UserRole = "admin";

  @Field()
    isEmailVerified: boolean = false;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}