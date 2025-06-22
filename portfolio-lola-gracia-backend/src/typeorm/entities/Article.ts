import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({name:'articles'})
export class Article {
  
        @Column({unique:true})
        @PrimaryGeneratedColumn('uuid')
        id:string;
        @Column({unique:true})
        title:string;
        @Column()
        content:string;
        @Column({unique:true})
        slug:string;

        
    
}