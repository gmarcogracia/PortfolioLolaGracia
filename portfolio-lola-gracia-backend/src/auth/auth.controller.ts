import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() input:{username:string,password:string},
         @Res({ passthrough: true }) res: Response
        ){
        const  userAccessTokenAndStuff = await  this.authService.authenticate(input);
        if(userAccessTokenAndStuff){
    res.cookie('access_token', userAccessTokenAndStuff.accessToken, {
    httpOnly: true,      
    secure: false,        //TODO poner a true cuando se pase a https
    sameSite: 'lax', //Porque usan dominios diferentes (Cambiar cuando se suba a servidor)
    maxAge: 1000 * 60 * 24*60 // 1 dia de validez
  });
        
  //La access token no se devuelve por seguridad
 delete (userAccessTokenAndStuff as {accessToken?: string}).accessToken;


        
        return userAccessTokenAndStuff;
        }
        return null;
 
    }
//Ruta para recibir info solo del usuario, Esta protegida mediante un guard
@UseGuards(AuthGuard)
    @Get('me')
    getUserInfo( @Request() request){
        return request.user;
        
    }
}
