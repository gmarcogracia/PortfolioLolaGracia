
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn }from 'typeorm';
@Entity({name:'users'})
export class User{
    @PrimaryGeneratedColumn('uuid')
    userId:string;
    @Column({unique:true})
    username:string;
    @Column()
    password:string;
    @Column({default:1})
    
    role:number;


}