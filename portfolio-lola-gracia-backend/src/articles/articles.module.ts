import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from 'src/typeorm/entities/Article';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({  
  imports:[TypeOrmModule.forFeature([Article]),
UsersModule,],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {}
