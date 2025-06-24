import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from '../typeorm/entities/Article';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({  
  imports:[TypeOrmModule.forFeature([Article]),
UsersModule,],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {}
