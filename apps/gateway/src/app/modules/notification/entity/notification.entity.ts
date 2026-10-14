import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  category: string;

  @Field(() => String, { nullable: true })
  sport?: string;

  @Field(() => String, { nullable: true })
  link?: string;

  @Field(() => String, { nullable: true })
  badge?: string;

  @Field(() => String, { nullable: true })
  badgeColor?: string;

  @Field(() => Boolean)
  read: boolean;

  @Field(() => Date)
  createdAt: Date;
}
