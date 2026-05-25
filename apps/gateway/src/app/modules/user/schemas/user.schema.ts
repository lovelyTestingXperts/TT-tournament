import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { UserRole } from '../../../shared/enums/user-role.enum';

export type UserDocument =
  HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  firstName!: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName!: string;

  @Prop({
    required: true,
    trim: true,
  })
  fullName!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    required: true,
    minlength: 6,
    select: false,
  })
  password!: string;

  @Prop({
    default: null,
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role!: UserRole;

  @Prop({
    default: null,
  })
  avatar?: string;

  @Prop({
    default: null,
  })
  bio?: string;

  @Prop({
    default: false,
  })
  isEmailVerified!: boolean;

  @Prop({
    default: true,
  })
  isActive!: boolean;

  @Prop({
    default: null,
    select: false,
  })
  refreshToken?: string;
  @Prop({
    default: null,
    select: false,
  })
  employeeId?: string;

  @Prop({
    default: null,
  })
  emailVerifiedAt?: Date;

  @Prop({
    default: null,
  })
  lastLoginAt?: Date;

  @Prop({
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    default: null,
  })
  deletedAt?: Date;
}

export const UserSchema =
  SchemaFactory.createForClass(User);

UserSchema.index({
  email: 1,
});

UserSchema.index({
  role: 1,
});

UserSchema.index({
  isActive: 1,
});

UserSchema.index({
  isDeleted: 1,
});