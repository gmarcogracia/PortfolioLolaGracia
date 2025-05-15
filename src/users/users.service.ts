import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';

//users seria el array de todos los usuarios obtenidos de base de datos


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>, ){
       
    }

    createUser() {
        throw new Error('Method not implemented.');
    }
    async findByName(username:string):Promise <User | undefined>
    {
        return users.find((user)=>user.username===username);
    }
    async findById(userId:number):Promise <User | undefined>{
        return users.find((user)=>user.userId=userId);
    }
    async fetchUsers(){

    }




}
