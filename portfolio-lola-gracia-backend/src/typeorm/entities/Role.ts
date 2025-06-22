import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({name:'roles'})
export class Role {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    name:string;
    @OneToMany(()=>User,(user)=>user.roleId)
    users:User[]
}