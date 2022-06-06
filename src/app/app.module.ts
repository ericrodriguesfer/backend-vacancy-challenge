import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistanceModule } from '../modules/distance/distance.module';
import { GraphModule } from '../modules/graph/graph.module';
import Graph from '../modules/graph/infra/typeorm/entities/Graph';
import { RoutesModule } from '../modules/routes/routes.module';
import { AppController } from './controllers/app.controller';
import SearchTownsImplementations from './providers/SearchTowns/implementations/SearchTownsImplementations';
import SetupGraphImplementations from './providers/SetupGraph/implementations/SetupGraphImplementations';
import AppService from './services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Graph],
    }),
    GraphModule,
    RoutesModule,
    DistanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SetupGraphImplementations,
    SearchTownsImplementations,
  ],
  exports: [SetupGraphImplementations, SearchTownsImplementations],
})
export class AppModule {}
