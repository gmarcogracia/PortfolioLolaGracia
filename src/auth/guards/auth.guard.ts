import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService) { }


  async canActivate(context: ExecutionContext) {
    const request= context.switchToHttp().getRequest(); //Pilla la request
    console.log("Request");
    console.log(request)
    const authorization = request.headers.authorization 
    //Pilla los headers de autorizacion de la request  (Deberia devolver Bearer <token>)
    const token = authorization?.split(' ')[1]; //Intenta extraer el token
    console.log(token, authorization);
 
    if (!token) {
      throw new UnauthorizedException("Por favor asegurate de que te has registrado")
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      console.log("Payload :", tokenPayload)
      //Aqui se podria meter la gestion con roles, que pille el id del usuario del token y que con eso te pille tambien el rol 
      request.user = {
        userId: tokenPayload.sub,
        username: tokenPayload.username,
        

      }

      const currentUser = await this.userService.findById(request.user.userId);
     
   



      return true;
    }
    catch (error) {
      // console.log(error, request.user, "Payload")
      throw new UnauthorizedException("Token no valido")
    }
  }
}
