import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import GetGraphDTO from '../dto/GetGraphDTO';
import Graph from '../infra/typeorm/entities/Graph';

@Injectable()
class GetGraphService {
  constructor(
    @InjectRepository(Graph) private graphRepository: Repository<Graph>,
  ) {}

  async execute({ id }: GetGraphDTO): Promise<Graph> {
    try {
      const graph: Graph = await this.graphRepository.findOne({
        where: { id },
      });

      if (!graph) {
        throw new NotFoundException(
          'This graph solicited does not exists in our database',
        );
      }

      return graph;
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Internal server error, please try again',
      );
    }
  }
}

export default GetGraphService;
