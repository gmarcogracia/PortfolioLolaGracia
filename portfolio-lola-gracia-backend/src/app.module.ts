import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { URL } from 'url';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { AuthModule } from './auth/auth.module';

import { User } from './typeorm/entities/User';
import { Role } from './typeorm/entities/Role';
import { Article } from './typeorm/entities/Article';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const env = config.get<string>('ENV');

        if (env === 'LOCAL') {
          // 🏡 Conexión local MySQL
          return {
            type: 'mysql',
            host: config.get<string>('DATABASE_HOST'),
            port: Number(config.get<string>('DATABASE_PORT')),
            username: config.get<string>('DATABASE_USER'),
            password: config.get<string>('DATABASE_PASSWORD'),
            database: "portfoliololagracia",
            entities: [User, Role, Article],
            synchronize: false,
          };
        } else {
          // ☁️ Producción con CockroachDB
          const rawDbUrl = config.get<string>('DATABASE_URL');
          if (!rawDbUrl) {
            throw new Error('DATABASE_URL is not defined in .env');
          }

          const dbUrl = new URL(rawDbUrl);
          const routingId = dbUrl.searchParams.get('options');
          dbUrl.searchParams.delete('options');

          return {
            type: 'cockroachdb',
            url: dbUrl.toString(),
            ssl: true,
            extra: routingId ? { options: routingId } : {},
            entities: [User, Role, Article],
            synchronize: false,
          };
        }
      },
    }),

    UsersModule,
    ArticlesModule,
    PodcastsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
