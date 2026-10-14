import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TournamentResolver } from './tournament.resolver';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
      {
        name: Match.name,
        schema: MatchSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [TournamentResolver, TournamentService],
  controllers: [TournamentController],
  exports: [TournamentService],
})
export class TournamentModule {}
