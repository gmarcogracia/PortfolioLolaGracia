import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = {username:string; password:string} //Esto es lo que se va a comprobar
type SignInData ={userId:number,username:string,role:string}//Lo que devuelve al hacerSignIn
type AuthResult ={accessToken:string; userId:number; username:string}
@Injectable()
export class AuthService {
    constructor (
        private userService: UsersService,
        private jwtService:JwtService    ){}
  
        //This checks that user exists in database. If user exists it returns his id and username, otherwise it returns null
    async validateUser(input:AuthInput):Promise <SignInData |null>{
        const user = await this.userService.findByName(input.username)
        if(user && user.password === input.password){
            //If user exists in DB and its password equals introduced   
            return {
                userId:user.userId,
                username:user.username,
                role: user.role
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
            sub:user.userId, //Esto se usa mas tarde
            username:user.username,

        }
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        return {accessToken,username:user.username,userId:user.userId}
    }

}

