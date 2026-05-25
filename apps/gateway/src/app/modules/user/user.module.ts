import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './user.service';

import {
  User,
  UserSchema,
} from './schemas/user.schema';
import { UsersResolver } from './user.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],

  providers: [UsersResolver, UsersService],

  exports: [UsersService], // IMPORTANT
})
export class UsersModule {}