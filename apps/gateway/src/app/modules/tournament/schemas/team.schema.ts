import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class TeamMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true })
  email!: string;

  @Prop({ default: 'PLAYER' })
  roleInTeam!: string;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

@Schema({ timestamps: true })
export class Team {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  captainId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  captainName!: string;

  @Prop({ type: [TeamMemberSchema], default: [] })
  members!: TeamMember[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
