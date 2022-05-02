/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
import { AppModule } from './app/app.module';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    cors({
      origin: '*',
    })
  );
  const port = process.env.PORT || 3333;

  const config = new DocumentBuilder()
    .setTitle('WhatsUpp')
    .setDescription(
      'The Chat API description. (Final project of the 3rd year @ YNOV)'
    )
    .setVersion('0.1')
    .addTag('chat')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
