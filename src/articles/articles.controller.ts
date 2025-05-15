import { Controller, Get, HttpCode, HttpStatus, NotImplementedException, Param, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor (private articlesService: ArticlesService ){}
        //Para pasarle el parametro por  url
    @Get(':id')
    async findOne(@Param() id:string){
     const podcast = await this.articlesService.findOne()
        
    }


}
