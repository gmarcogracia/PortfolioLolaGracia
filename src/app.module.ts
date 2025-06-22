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
import { Role } from './typeorm/entities/Role';
import { ConfigModule } from '@nestjs/config';
import { envToNumber, getEnv } from './utils/globalFunctions';
import { Article } from './typeorm/entities/Article';




@Module({
  imports: [UsersModule, ArticlesModule, PodcastsModule, AuthModule,
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost', //process.env.DATABASE_HOST,//TODO Cambiar cuando esté migrado al servidor
      port:3306,
      username:'root',
      password:'',
      database:'portfoliololagracia',
      entities:[User,Role,Article],
      synchronize:false
    }),
    ConfigModule.forRoot({isGlobal:true})
  ],
  controllers: [AppController],
  providers: [AppService],
})




export class AppModule {}
