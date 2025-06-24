import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';



export type User = {
    userId: number;
    username: string;
    password: string;
    role: string;
}


@Controller('users')
export class UsersController {
    //Add service to class
    constructor(private usersService: UsersService) {

    }

    @UseGuards(AdminGuard)
    @Get('list')//Lista todos los usuarios que no sean administradores (Solo lo puede ver el admin)
    async getUsers() {
        const users = await this.usersService.fetchUsers();
        return users;

    }



    @Post('/create')
    async create(@Body() input: CreateUserDto) {
    
        const existingUser = await this.usersService.findByName(input.username)
  
        if (existingUser != null) {
            throw new NotFoundException("Ya existe ese usuario");
        } else {

            return this.usersService.createUser(input);
        }





    }
    // @Delete('delete'){

    // }

    //unimplemented
    // @Put(':id')
    // updateUserById(
    //     @Param('id', ParseUUIDPipe) id: string,
    //     @Body() updateUserDto: UpdateUserDto
    // ) {
    //     this.usersService.updateUser(id, updateUserDto);
    // }
    //COnvierte al usuario en editor
    @UseGuards(AdminGuard)    
    @Patch(':id')
    grantRoleById(
        @Param('id', ParseUUIDPipe) id: string,
        
    ) {
        //Da el rol y lo devuelve
       const role = this.usersService.grantRole(id);
       return role
       
    }
    @Delete(':id')
    deleteUserById(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        this.usersService.deleteUser(id);
    }


}
