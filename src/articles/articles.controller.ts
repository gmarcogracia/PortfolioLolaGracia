import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { createArticleParams } from 'src/utils/customTypes';
import { EditorGuard } from 'src/auth/guards/editor.guard';
import { catchError } from 'rxjs';

@Controller('articles')
export class ArticlesController {
    constructor (private articlesService: ArticlesService ){}
        //Para pasarle el parametro por  url
    @Get('/:slug')
    async findOne(@Param('slug') slug:string){
        console.log("Im a slimy slug",slug)
     const article = await this.articlesService.findOne(slug);
        return article
    }
    //Solo pueden guardar articulos editores o creadores
    @UseGuards(EditorGuard)
    @Post("/save")
    async saveArticle(@Body() input:createArticleParams){
        try{this.articlesService.createArticle(input);
            return true
        }catch{
            return false;
        }

    }
    @UseGuards(EditorGuard)
    @Put("/:id")
    async editArticle(@Param('id') id:string,@Body() input:createArticleParams){
      await this.articlesService.editArticle(input,id);

    }

    @Get("/")
    async fetchArticles(){
        try{
            return this.articlesService.findAll();
        }catch(exception){

        }
    }

}
