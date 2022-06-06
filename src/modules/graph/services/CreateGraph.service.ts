import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateGraphDTO from '../dto/CreateGraphDTO';
import Graph from '../infra/typeorm/entities/Graph';

@Injectable()
class CreateGraphService {
  constructor(
    @InjectRepository(Graph) private graphRepository: Repository<Graph>,
  ) {}

  async execute({ data }: CreateGraphDTO): Promise<Graph> {
    try {
      const graph: Graph = await this.graphRepository.create({ data });

      await this.graphRepository.save(graph);

      return graph;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Internal server error, please try again',
      );
    }
  }
}

export default CreateGraphService;
