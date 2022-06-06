import { Inject, Injectable } from '@nestjs/common';
import { DirectedGraph } from 'graphology';
import { allSimplePaths } from 'graphology-simple-path';
import ISetupGraph from '../../../../../app/providers/SetupGraph/contracts/ISetupGraph';
import SetupGraphImplementations from '../../../../../app/providers/SetupGraph/implementations/SetupGraphImplementations';
import Graph from '../../../../graph/infra/typeorm/entities/Graph';
import IResponseSearchRoutes from '../../../infra/contracts/IResponseSearchRoutes';
import ISearchRoutes from '../contracts/ISearchRoutes';

@Injectable()
class SearchRoutesImplementations implements ISearchRoutes {
  constructor(
    @Inject(SetupGraphImplementations) private readonly setup: ISetupGraph,
  ) {}

  public async search(
    graph: Graph,
    town1: string,
    town2: string,
    maxStops: number,
  ): Promise<IResponseSearchRoutes> {
    const response: IResponseSearchRoutes = { routes: [] };
    let paths = [];

    const graphMounted: DirectedGraph = await this.setup.execute(graph);

    if (maxStops > 0) {
      paths = allSimplePaths(graphMounted, town1, town2, {
        maxDepth: maxStops,
      });
    } else {
      paths = allSimplePaths(graphMounted, town1, town2);
    }

    response.routes = paths.map((path) => {
      return { route: String(path).replace(/,/g, ''), stops: path.length - 1 };
    });

    return response;
  }
}

export default SearchRoutesImplementations;
