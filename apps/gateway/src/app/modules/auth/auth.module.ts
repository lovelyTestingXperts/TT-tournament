import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('jwtAccessSecret') ||
          process.env.JWT_ACCESS_SECRET ||
          'access_secret',
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtAuthGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}