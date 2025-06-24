import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cookieParser  from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host ='localhost'
//Esto es necesario porque si no saltan fallos de cors al hacer peticiones
  app.enableCors({
    origin: process.env.FRONTEND_SERVER_ADDRESS, // Next.js frontend
    credentials: true, // Para usar cookies y headers
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3001,host); //CAMBIAR PUERTO
  const logger = new Logger('bootstrap');
  logger.log(`Listening on ${await app.getUrl()}`);
}
bootstrap();
