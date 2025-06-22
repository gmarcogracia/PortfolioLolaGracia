import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserParams, UpdateUserParams } from 'src/utils/customTypes';
import { AsignRoleDto } from './dto/asign-role.dto';
import { NotFoundError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';


//users seria el array de todos los usuarios obtenidos de base de datos


@Injectable()
export class UsersService {
   async grantRole(userId: string) {
        var user =  await this.userRepository.findOneBy({ userId });
        if (!user) {
            throw new NotFoundException('USER NOT FOUND');
        }
        if(user.roleId == 2){
        user.roleId = 1
        }else{
        user.roleId = 2;
        }
     this.userRepository.save(user);
     return user.roleId;


        


    }

    deleteUser //Devolverlo lo awaitea
        (id: string) {
        var userId = id;
        this.userRepository.delete({ userId })
    }

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService
    ) {

    }

    async createUser(createUserDetails: CreateUserParams) {
        const bcrypt = require('bcrypt');
        const password = createUserDetails.password;
   
        const hash = await bcrypt.hash(password,Number(this.configService.get("SALT_ROUNDS")))
        const userName = createUserDetails.username;
        const newUser = await this.userRepository.create({username:userName,password:hash, userId: uuidv4() });
        
        return this.userRepository.save(newUser);

    }
    async findByName(username: string): Promise<User | null> {
        const user = this.userRepository.findOne({
            where: {
                username: username

            }
        });

        return user;
        // return users.find((user)=>user.username===username);
        // throw new NotImplementedException
    }
    async findById(userId: string): Promise<User | null> {
        const user = this.userRepository.findOne({
            where:{
                userId:userId
            }
        });
        
      return user ;
  
    }
    async fetchUsers() {
     const users =  await this.userRepository.find({where:{
            roleId:Not(1)
        }});
        return users
    }
    //Unimplemented
    // updateUser(userId: string, UpdateUserDetails: UpdateUserParams) {
    //     //Devolverlo lo awaitea
    //     return this.userRepository.update(
    //         { userId } //Criterio por el que buscar el registro que actualizar
    //         , { ...UpdateUserDetails })

    // }



}
