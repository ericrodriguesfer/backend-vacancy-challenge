import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import GraphController from './infra/http/graph.controller';
import Graph from './infra/typeorm/entities/Graph';
import CreateGraphService from './services/CreateGraph.service';
import GetGraphService from './services/GetGraph.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Graph])],
  controllers: [GraphController],
  providers: [CreateGraphService, GetGraphService],
})
export class GraphModule {}
