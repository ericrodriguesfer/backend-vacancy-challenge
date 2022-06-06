import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISearchTowns from '../../../app/providers/SearchTowns/contracts/ISearchTowns';
import SearchTownsImplementations from '../../../app/providers/SearchTowns/implementations/SearchTownsImplementations';
import Graph from '../../../modules/graph/infra/typeorm/entities/Graph';
import GetMinDistanceDTO from '../dto/GetMinDistanceDTO';
import IResponseGetMinDistanceDTO from '../infra/contracts/IResponseGetMinDistanceDTO';
import ISearchMinDistance from '../providers/SearchMinDistance/contracts/ISearchMinDistance';
import SearchMinDistanceImplementation from '../providers/SearchMinDistance/implementations/SearchMinDistanceImplementation';

@Injectable()
class GetMinDistanceService {
  constructor(
    @InjectRepository(Graph) private graphRepository: Repository<Graph>,
    @Inject(SearchMinDistanceImplementation)
    private readonly searchMinDistance: ISearchMinDistance,
    @Inject(SearchTownsImplementations)
    private readonly searchTowns: ISearchTowns,
  ) {}

  async execute({
    id,
    town1,
    town2,
  }: GetMinDistanceDTO): Promise<IResponseGetMinDistanceDTO> {
    try {
      const graph: Graph = await this.graphRepository.findOne({
        where: { id },
      });

      if (!graph) {
        throw new NotFoundException(
          'This graph solicited does not exists in our database',
        );
      }

      const searchTownsResponse: boolean = await this.searchTowns.execute(
        graph,
        town1.toUpperCase(),
        town2.toUpperCase(),
      );

      if (!searchTownsResponse) {
        throw new ConflictException(
          'A of the two towns passed on does not exist in this graph',
        );
      }

      if (town1.toUpperCase() === town2.toUpperCase()) {
        return { distance: 0, path: [] };
      }

      return await this.searchMinDistance.search(
        graph,
        town1.toUpperCase(),
        town2.toUpperCase(),
      );
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Internal server error, please try again',
      );
    }
  }
}

export default GetMinDistanceService;
