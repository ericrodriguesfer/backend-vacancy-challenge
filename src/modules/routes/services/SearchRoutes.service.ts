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
import Graph from '../../graph/infra/typeorm/entities/Graph';
import SearchRoutesDTO from '../dto/SearchRoutesDTO';
import IResponseSearchRoutes from '../infra/contracts/IResponseSearchRoutes';
import ISearchRoutes from '../providers/SearchRoutes/contracts/ISearchRoutes';
import SearchRoutesImplementations from '../providers/SearchRoutes/implementations/SearchRoutesImplementations';

@Injectable()
class SearchRoutesService {
  constructor(
    @InjectRepository(Graph) private graphRepository: Repository<Graph>,
    @Inject(SearchRoutesImplementations)
    private readonly searchRoutes: ISearchRoutes,
    @Inject(SearchTownsImplementations)
    private readonly searchTowns: ISearchTowns,
  ) {}

  async execute({
    id,
    town1,
    town2,
    maxStops,
  }: SearchRoutesDTO): Promise<IResponseSearchRoutes> {
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
        return { routes: [] };
      }

      return await this.searchRoutes.search(
        graph,
        town1.toUpperCase(),
        town2.toUpperCase(),
        maxStops,
      );
    } catch (error) {
      if (error) throw error;
      throw new InternalServerErrorException(
        'Internal server error, please try again',
      );
    }
  }
}

export default SearchRoutesService;
