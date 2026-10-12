import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Pagination metadata for list queries' })
export class PaginationMeta {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}
