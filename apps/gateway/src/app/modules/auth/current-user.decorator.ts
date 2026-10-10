import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface CurrentUserPayload {
  userId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ): CurrentUserPayload | null => {
    const gqlContext = GqlExecutionContext.create(context);
    const gqlRequest =
      gqlContext.getContext().req ??
      gqlContext.getContext().request;

    if (gqlRequest?.user) {
      return gqlRequest.user;
    }

    const httpRequest = context.switchToHttp().getRequest();
    return httpRequest?.user ?? null;
  },
);
