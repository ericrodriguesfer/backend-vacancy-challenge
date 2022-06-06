import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SearchTownsImplementations from '../../app/providers/SearchTowns/implementations/SearchTownsImplementations';
import SetupGraphImplementations from '../../app/providers/SetupGraph/implementations/SetupGraphImplementations';
import Graph from '../graph/infra/typeorm/entities/Graph';
import DistanceController from './infra/http/distance.controller';
import SearchMinDistanceImplementation from './providers/SearchMinDistance/implementations/SearchMinDistanceImplementation';
import GetMinDistanceService from './services/GetMinDistance.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Graph])],
  controllers: [DistanceController],
  providers: [
    GetMinDistanceService,
    SearchMinDistanceImplementation,
    SetupGraphImplementations,
    SearchTownsImplementations,
  ],
})
export class DistanceModule {}
