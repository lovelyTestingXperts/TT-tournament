import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, default: 'system' })
  category: string; // 'tournament' | 'match' | 'system' | 'news'

  @Prop()
  sport?: string;

  @Prop()
  link?: string;

  @Prop()
  badge?: string;

  @Prop()
  badgeColor?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: [String], default: [] })
  readBy: string[]; // List of userIds who marked this as seen / read

  // MongoDB native TTL index (10 days in seconds = 864,000s)
  @Prop({ type: Date, default: Date.now, expires: 864000 })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ createdAt: -1 });
