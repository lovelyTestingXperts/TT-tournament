import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationEntity } from './entity/notification.entity';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private retentionDays: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly configService: ConfigService,
  ) {
    this.retentionDays = this.configService.get<number>('notificationRetentionDays') || 10;
  }

  async onModuleInit() {
    this.logger.log(
      `NotificationService initialized with ${this.retentionDays}-day retention policy.`,
    );

    // Initial purge of old notifications
    await this.purgeOldNotifications();

    // Schedule hard delete purge once every 24 hours
    this.cleanupInterval = setInterval(
      () => {
        this.purgeOldNotifications().catch((err) =>
          this.logger.error('Error during scheduled notification purge:', err),
        );
      },
      24 * 60 * 60 * 1000,
    );

    // Ensure initial platform notifications exist if collection is empty
    await this.seedInitialNotificationsIfEmpty();
  }

  /**
   * Broadcast a notification to all users across the platform
   */
  async createNotification(data: {
    title: string;
    message: string;
    category?: string;
    sport?: string;
    link?: string;
    badge?: string;
    badgeColor?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationDocument> {
    const notif = await this.notificationModel.create({
      title: data.title,
      message: data.message,
      category: data.category || 'system',
      sport: data.sport,
      link: data.link,
      badge: data.badge,
      badgeColor: data.badgeColor,
      metadata: data.metadata,
      readBy: [],
      createdAt: new Date(),
    });

    this.logger.log(`Broadcast Notification created: "${data.title}"`);
    return notif;
  }

  /**
   * Retrieve notifications with per-user read/seen status
   */
  async getNotifications(userId?: string): Promise<NotificationEntity[]> {
    const notifications = await this.notificationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    return notifications.map((n) => this.mapToEntity(n, userId));
  }

  /**
   * Get unread notification count for a specific user
   */
  async getUnreadCount(userId?: string): Promise<number> {
    if (!userId) {
      return this.notificationModel.countDocuments({ readBy: { $size: 0 } }).exec();
    }
    return this.notificationModel
      .countDocuments({ readBy: { $ne: userId } })
      .exec();
  }

  /**
   * Mark a single notification as seen / read by a user
   */
  async markAsRead(notificationId: string, userId?: string): Promise<NotificationEntity | null> {
    const userIdentifier = userId || 'anonymous';
    const notif = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { $addToSet: { readBy: userIdentifier } },
      { new: true },
    );

    if (!notif) return null;
    return this.mapToEntity(notif, userId);
  }

  /**
   * Mark all notifications as seen / read for a user
   */
  async markAllAsRead(userId?: string): Promise<boolean> {
    const userIdentifier = userId || 'anonymous';
    await this.notificationModel.updateMany(
      { readBy: { $ne: userIdentifier } },
      { $addToSet: { readBy: userIdentifier } },
    );
    return true;
  }

  /**
   * Clear notifications
   */
  async clearAllNotifications(): Promise<boolean> {
    await this.notificationModel.deleteMany({});
    return true;
  }

  /**
   * Hard delete notifications older than the configurable retention window (default: 10 days)
   */
  async purgeOldNotifications(days: number = this.retentionDays): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await this.notificationModel.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    if (result.deletedCount && result.deletedCount > 0) {
      this.logger.log(
        `Hard deleted ${result.deletedCount} notifications older than ${days} days (cutoff: ${cutoffDate.toISOString()}) to save storage space.`,
      );
    }
    return result.deletedCount || 0;
  }

  private mapToEntity(n: NotificationDocument, userId?: string): NotificationEntity {
    const isRead = userId ? n.readBy?.includes(userId) : false;
    return {
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      category: n.category,
      sport: n.sport,
      link: n.link,
      badge: n.badge,
      badgeColor: n.badgeColor,
      read: isRead,
      createdAt: n.createdAt,
    };
  }

  private async seedInitialNotificationsIfEmpty() {
    const count = await this.notificationModel.countDocuments();
    if (count === 0) {
      await this.notificationModel.create([
        {
          title: 'Quarterfinal Live: Sharath Kamal vs Manav Thakkar',
          message: 'Table Tennis Grand Smash Set 3 underway on Table 1. Match is heating up!',
          category: 'match',
          sport: 'Table Tennis',
          badge: 'LIVE',
          badgeColor: 'border-rose-500/40 bg-rose-500/20 text-rose-300',
          link: '/matches',
          readBy: [],
          createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
        },
        {
          title: 'Registration Open: WTT Star Contender 2026',
          message: '16 singles player slots opened. Register before deadline to participate in the $2,500 cup.',
          category: 'tournament',
          sport: 'Table Tennis',
          badge: 'OPEN',
          badgeColor: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300',
          link: '/tournaments',
          readBy: [],
          createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        },
        {
          title: 'Fixtures Drawn: T20 Premier Cricket League',
          message: 'Wave 1 fixtures generated! Thunder Strikers vs Blazing Knights scheduled for opening match.',
          category: 'match',
          sport: 'Cricket',
          badge: 'FIXTURE',
          badgeColor: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
          link: '/matches',
          readBy: [],
          createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
        },
        {
          title: 'Champion Crowned: PV Sindhu Wins Badminton Masters',
          message: 'PV Sindhu crowned tournament champion after a 21-18, 21-19 thriller in the final!',
          category: 'tournament',
          sport: 'Badminton',
          badge: 'WINNER',
          badgeColor: 'border-yellow-500/40 bg-yellow-500/20 text-yellow-300',
          link: '/tournaments',
          readBy: [],
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hrs ago
        },
      ]);
    }
  }
}
