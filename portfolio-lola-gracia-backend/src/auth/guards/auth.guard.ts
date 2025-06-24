import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService) { }


  async canActivate(context: ExecutionContext) {
    const request= context.switchToHttp().getRequest(); //Pilla la request

    const authorization = request.headers.authorization 
    //Pilla los headers de autorizacion de la request  (Deberia devolver Bearer <token>)
    const token = authorization?.split(' ')[1]; //Intenta extraer el token
 
 
    if (!token) {
      throw new UnauthorizedException("Por favor asegurate de que te has registrado")
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
    

      request.user = {
        userid: tokenPayload.sub,
        username: tokenPayload.username,
        

      }

      const currentUser = await this.userService.findById(request.user.userid);
     
   



      return true;
    }
    catch (error) {

      throw new UnauthorizedException("Token no valido")
    }
  }
}
