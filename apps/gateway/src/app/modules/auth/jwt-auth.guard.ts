import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const request =
      gqlContext.getContext().req ??
      gqlContext.getContext().request ??
      context.switchToHttp().getRequest();

    if (!request?.user) {
      throw new UnauthorizedException(
        'Authentication required.',
      );
    }

    return true;
  }
}
