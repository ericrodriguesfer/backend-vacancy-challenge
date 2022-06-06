import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SearchTownsImplementations from '../../app/providers/SearchTowns/implementations/SearchTownsImplementations';
import SetupGraphImplementations from '../../app/providers/SetupGraph/implementations/SetupGraphImplementations';
import Graph from '../graph/infra/typeorm/entities/Graph';
import RoutesController from './infra/http/routes.controller';
import SearchRoutesImplementations from './providers/SearchRoutes/implementations/SearchRoutesImplementations';
import SearchRoutesService from './services/SearchRoutes.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Graph])],
  controllers: [RoutesController],
  providers: [
    SearchRoutesService,
    SearchRoutesImplementations,
    SetupGraphImplementations,
    SearchTownsImplementations,
  ],
})
export class RoutesModule {}
