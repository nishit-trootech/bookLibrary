import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import dotenv from 'dotenv';
import { CustomAllExceptionFilter } from './common/filters/custom-all-exception.filter';
import { CustomNotFoundExceptionFilter } from './common/filters/custom-not-found-exception.filter';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.enableCors();

  app.useGlobalFilters(
    new CustomAllExceptionFilter(),
    new CustomNotFoundExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  const config = new DocumentBuilder()
    .setTitle('Books Store')
    .setDescription('Books Store API')
    .setVersion('v1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  const port = process.env.PORT || 3000;

  await app.listen(port);

  Logger.log(`Application is listening on: ${await app.getUrl()}`);
}
bootstrap();
