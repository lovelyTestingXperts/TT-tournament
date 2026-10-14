import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { NotificationEntity } from './entity/notification.entity';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';

@Resolver(() => NotificationEntity)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [NotificationEntity], { name: 'notifications' })
  async getNotifications(
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getNotifications(user?.userId);
  }

  @Query(() => Int, { name: 'unreadNotificationCount' })
  async getUnreadCount(
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<number> {
    return this.notificationService.getUnreadCount(user?.userId);
  }

  @Mutation(() => NotificationEntity, { nullable: true })
  async markNotificationAsRead(
    @Args('id') id: string,
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<NotificationEntity | null> {
    return this.notificationService.markAsRead(id, user?.userId);
  }

  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(
    @CurrentUser() user?: CurrentUserPayload,
  ): Promise<boolean> {
    return this.notificationService.markAllAsRead(user?.userId);
  }

  @Mutation(() => Boolean)
  async clearAllNotifications(): Promise<boolean> {
    return this.notificationService.clearAllNotifications();
  }
}
