import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
    })
    password!: string;

    @Prop({
        default: null,
    })
    phoneNumber?: string;
    
    @Prop({
        default: null,
        required: true
    })
    employeeId!: string;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.MEMBER,
    })
    role!: UserRole;

    @Prop({
        default: false,
    })
    isEmailVerified!: boolean;

    @Prop({
        default: null,
    })
    refreshToken?: string;
}

export const UserSchema =
    SchemaFactory.createForClass(User);