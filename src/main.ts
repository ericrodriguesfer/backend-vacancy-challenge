import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import setupSwagger from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(process.env.PORT || 3333);
}
bootstrap();
