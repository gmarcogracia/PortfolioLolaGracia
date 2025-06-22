
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn }from 'typeorm';
import { Role } from './Role';
@Entity({name:'users'})
export class User{
    @Column({unique:true})
    @PrimaryGeneratedColumn('uuid')
    userId:string;
    @Column({unique:true})
    username:string;
    @Column()
    password:string;
    
    // @Column({default:3})
    // @ManyToOne(()=>Role, (role)=>role.id)
     //Un rol puede ser tenido por varios usuarios pero un usuario solo tiene un rol
    @Column({default:3})
     roleId: number;


}