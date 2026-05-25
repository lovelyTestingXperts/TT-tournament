import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

import configuration from './shared/config/configuration';
import { validateEnv } from './shared/config/env.validation';
import { AppResolver } from './app.resolver';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],

      validate: (config) =>
        validateEnv(config),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: true,

      playground: true,
      sortSchema: true,

      context: ({ req }) => ({ req }),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        uri:
          configService.get<string>(
            'mongoUri',
          ),
      }),
    }),
  ],
  providers: [AppResolver],
})
export class AppModule { }