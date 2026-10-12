import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const request =
      gqlContext.getContext().req ??
      gqlContext.getContext().request ??
      context.switchToHttp().getRequest();

    const authHeader = request?.headers?.authorization || request?.headers?.Authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authentication required. Missing token.');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format. Expected Bearer <token>.');
    }

    try {
      const secret =
        this.configService.get<string>('jwtAccessSecret') ||
        process.env.JWT_ACCESS_SECRET ||
        'access_secret';

      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token is expired or invalid.');
    }
  }
}
