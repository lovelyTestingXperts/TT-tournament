import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { TournamentType } from '../enums/tournament-type.enum';
import { TournamentStatus } from '../enums/tournament-status.enum';
import { TournamentVisibility } from '../enums/tournament-visibility.enum';
import { TournamentFormat } from '../enums/tournament-format.enum';

export type TournamentDocument = HydratedDocument<Tournament>;

@Schema({
  timestamps: true,
})
export class Tournament {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: null, trim: true })
  description?: string;

  @Prop({ default: null, trim: true })
  category?: string;

  @Prop({
    type: String,
    enum: TournamentType,
    required: true,
  })
  type!: TournamentType;

  @Prop({
    type: String,
    enum: TournamentFormat,
    required: true,
  })
  format!: TournamentFormat;

  @Prop({
    type: String,
    enum: TournamentVisibility,
    required: true,
  })
  visibility!: TournamentVisibility;

  @Prop({ default: null, trim: true })
  bannerImage?: string;

  @Prop({ default: null })
  maxPlayers?: number;

  @Prop({ default: null })
  prizePool?: number;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ required: true })
  registrationDeadline!: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  participants!: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Match' }],
    default: [],
  })
  matches!: Types.ObjectId[];

  @Prop({
    type: String,
    enum: TournamentStatus,
    default: TournamentStatus.DRAFT,
  })
  status!: TournamentStatus;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop({ default: null })
  deletedAt?: Date;
}

export const TournamentSchema =
  SchemaFactory.createForClass(Tournament);

TournamentSchema.index({ createdBy: 1 });
TournamentSchema.index({ status: 1 });
TournamentSchema.index({ type: 1 });
TournamentSchema.index({ visibility: 1 });
TournamentSchema.index({ createdAt: 1 });
TournamentSchema.index({ startDate: 1 });
TournamentSchema.index({ isDeleted: 1 });
