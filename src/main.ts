import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.gaurd';
import { PermissionsGuard } from './common/guards/permission.gaurd';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')

  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  const reflector = app.get(Reflector)
  app.useGlobalGuards(
    new JwtAuthGuard(reflector), 
    new PermissionsGuard(reflector)
  )


  app.use(cors({
    origin: process.env.FE_DOMAIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }));
  
  await app.listen(process.env.PORT);
}
bootstrap();
