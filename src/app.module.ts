import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rootCertificates } from 'tls';
import { User } from './typeorm/entities/User';

@Module({
  imports: [UsersModule, ArticlesModule, PodcastsModule, AuthModule,
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',//TODO Cambiar cuando esté migrado al servidor
      port:3306,
      username:'root',
      password:'',
      database:'portfoliololagracia',
      entities:[User],
      synchronize:true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
