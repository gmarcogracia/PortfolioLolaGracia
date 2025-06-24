import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


type AuthInput = {username:string; password:string} //Esto es lo que se va a comprobar
type SignInData ={userid:string,username:string,roleId:number}//Lo que devuelve al hacerSignIn
type AuthResult ={accessToken:string; userid:string; username:string}
@Injectable()
export class AuthService {
    constructor (
        private userService: UsersService,
        private jwtService:JwtService,
    private configService:ConfigService    ){}
  
        //This checks that user exists in database. If user exists it returns his id and username, otherwise it returns null
    async validateUser(input:AuthInput):Promise <SignInData |null>{
    
        const user = await this.userService.findByName(input.username)
        const bcrypt = require('bcrypt');
        if (!user){
        throw new NotFoundException("No se ha encontrado un usuario con ese nombre");
        }
        if(user &&     await(bcrypt.compare(input.password,user.password))){
            //If user exists in DB and its password equals introduced   
            return {
                userid:user.userid,
                username:user.username,
                roleId: user.roleId
            }//Equal to signindata
        }
        return null
    }
    async authenticate(input:AuthInput):Promise<AuthResult |null>{
        const user= await this.validateUser(input)
        if(!user){
            throw new UnauthorizedException('No se ha encontrado un usuario con ese nombre y contraseña');
        }
        return this.signIn(user); //Once authenticated, signIn is called to return an AuthResult with a generated token

    }
    async signIn(user:SignInData): Promise<AuthResult>{
        const tokenPayload = {
            sub:user.userid, //Esto se usa mas tarde
            username:user.username,
            roleId:user.roleId
            

        }
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        return {accessToken,username:user.username,userid:user.userid}
    }





}

