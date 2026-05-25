import { registerEnumType } from '@nestjs/graphql';

export enum UserSortField {
  CREATED_AT = 'createdAt',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
}

registerEnumType(
  UserSortField,
  {
    name: 'UserSortField',
  },
);