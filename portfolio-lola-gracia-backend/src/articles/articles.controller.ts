import { Body, Controller, Get,  Param, Post, Put, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { createArticleParams } from '../utils/customTypes';
import { EditorGuard } from '../auth/guards/editor.guard';
@Controller('articles')
export class ArticlesController {
    constructor (private articlesService: ArticlesService ){}
        //Para pasarle el parametro por  url
    @Get('/:slug')
    async findOne(@Param('slug') slug:string){
     
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
