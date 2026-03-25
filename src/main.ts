import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getEnvironmentConfig } from './config/environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Microsoft Graph API - Mail Service')
    .setDescription('NestJS application to send emails using Microsoft Graph API')
    .setVersion('1.0')
    .addTag('mail', 'Email sending endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const config = getEnvironmentConfig();
  await app.listen(config.port);
  
  console.log(`Application is running on: http://localhost:${config.port}`);
  console.log(`Swagger documentation: http://localhost:${config.port}/api`);
  console.log(`Mail endpoint: http://localhost:${config.port}/mail/send`);
}

bootstrap();
