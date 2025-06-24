import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private userService:UsersService,
    private jwtService:JwtService){}


 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const authorization = request.headers.authorization;
  let token: string | undefined;

  // Primero intenta con el header Authorization
  if (authorization?.startsWith('Bearer ')) {
    token = authorization.split(' ')[1];
  }

  // Si no hay Authorization header, intenta con cookie
  //Normalmente lo va aconseguir de aqui peor el anterior se metio por si acaso
  if (!token && request.cookies?.access_token) {
    token = request.cookies.access_token;
  }

  if (!token) {
    throw new UnauthorizedException("Por favor asegúrate de que te has autenticado");
  }

  try {
    const tokenPayload = await this.jwtService.verifyAsync(token);
    request.user = {
      userid: tokenPayload.sub,
      username: tokenPayload.username,
    };

    const currentUser = await this.userService.findById(request.user.userid);

    // Verifica que tenga rol adecuado de administrador (Administrador se corresponde a 1, editor a 2, los demas 3)
    if (!currentUser || currentUser.roleId === undefined || currentUser.roleId !=1) {
      throw new UnauthorizedException("No tienes permisos para acceder");
    }

    return true;
  } catch (error) {
    console.error("Error en la verificación del token:", error);
    throw new UnauthorizedException("Token no válido");
  }
}
}