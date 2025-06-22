import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/typeorm/entities/Article';
import { createArticleParams } from 'src/utils/customTypes';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticlesService {


    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,

    ) {

    }


    async findOne(slug:string) {
        const article = await this.articleRepository.findOneOrFail({where:{

            slug:slug
        }});
        return article;
    }

    async findAll() {
       const articles = await this.articleRepository.find();
       return articles;
    }

    async createArticle(createArticleParams: createArticleParams) {




        const newArticle = await this.articleRepository.create({ id: uuidv4(), ...createArticleParams })
        return this.articleRepository.save(newArticle);

    }

        async editArticle(createArticleParams: createArticleParams,id) {


        const article = await this.articleRepository.findOneByOrFail({ id:id })
        Object.assign(article, createArticleParams);

        return this.articleRepository.save(article);

    }

}
