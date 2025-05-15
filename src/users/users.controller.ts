import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';


export type User = {
    userId: number;
    username: string;
    password:string;
    role:string;
}


@Controller('users')
export class UsersController {
    //Add service to class
    constructor(private usersService: UsersService){

    }


    @Get('')
    getUsers(){
      
    }
    // @Post('/create/user')
    // create(@Body() input:CreateUserDto){
    //     return this.usersService.createUser();
    // }
}
