import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MatchDocument = HydratedDocument<Match>;

export enum MatchStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true })
  tournamentId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tournamentName!: string;

  @Prop({ required: true, default: 1 })
  round!: number;

  @Prop({ required: true, default: 'Round 1' })
  roundName!: string;

  @Prop({ required: true, default: 1 })
  matchNumber!: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  playerAId?: Types.ObjectId | null;

  @Prop({ default: 'TBD' })
  playerAName!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  playerBId?: Types.ObjectId | null;

  @Prop({ default: 'TBD' })
  playerBName!: string;

  @Prop({ type: String, default: null })
  teamAId?: string | null;

  @Prop({ type: String, default: null })
  teamAName?: string | null;

  @Prop({ type: String, default: null })
  teamBId?: string | null;

  @Prop({ type: String, default: null })
  teamBName?: string | null;

  @Prop({ default: 0 })
  scoreA!: number;

  @Prop({ default: 0 })
  scoreB!: number;

  @Prop({ type: String, default: null })
  scoreDetails?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winnerId?: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  winnerName?: string | null;

  @Prop({
    type: String,
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status!: MatchStatus;

  @Prop({ default: 1 })
  wave!: number;

  @Prop({ default: false })
  isFinal!: boolean;

  @Prop({ default: false })
  isBye!: boolean;

  @Prop({ type: Date, default: () => new Date() })
  scheduledAt!: Date;

  @Prop({ type: Date, default: null })
  completedAt?: Date | null;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

MatchSchema.index({ tournamentId: 1, round: 1, matchNumber: 1 });
MatchSchema.index({ status: 1 });
