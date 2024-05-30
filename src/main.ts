import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AxiosExceptionFilter } from './core/middlewares/axios.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AxiosExceptionFilter());
  await app.listen(3000);
}
bootstrap();
