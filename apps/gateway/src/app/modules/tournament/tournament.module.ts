import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TournamentResolver } from './tournament.resolver';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tournament.name,
        schema: TournamentSchema,
      },
    ]),
  ],
  providers: [TournamentResolver, TournamentService],
  controllers: [TournamentController],
  exports: [TournamentService],
})
export class TournamentModule {}
