import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../user/entity/user.entity';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field(() => UserEntity)
  user!: UserEntity;
}
