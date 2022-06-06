import { Inject, Injectable } from '@nestjs/common';
import { DirectedGraph } from 'graphology';
import { bidirectional } from 'graphology-shortest-path';
import { ShortestPath } from 'graphology-shortest-path/unweighted';
import ISetupGraph from '../../../../../app/providers/SetupGraph/contracts/ISetupGraph';
import SetupGraphImplementations from '../../../../../app/providers/SetupGraph/implementations/SetupGraphImplementations';
import INode from '../../../../../modules/graph/infra/contracts/INode';
import Graph from '../../../../../modules/graph/infra/typeorm/entities/Graph';
import IResponseGetMinDistanceDTO from '../../../infra/contracts/IResponseGetMinDistanceDTO';
import ISearchMinDistance from '../contracts/ISearchMinDistance';

@Injectable()
class SearchMinDistanceImplementation implements ISearchMinDistance {
  constructor(
    @Inject(SetupGraphImplementations) private readonly setup: ISetupGraph,
  ) {}

  public async search(
    graph: Graph,
    town1: string,
    town2: string,
  ): Promise<IResponseGetMinDistanceDTO> {
    const response: IResponseGetMinDistanceDTO = { distance: 0, path: [] };

    const graphMounted: DirectedGraph = await this.setup.execute(graph);

    const path: ShortestPath = bidirectional(graphMounted, town1, town2);

    if (!path) {
      response.distance = -1;
    } else {
      let distance = 0;

      path.forEach((currentPath, index) => {
        graph.data.forEach((node: INode) => {
          if (node.source === currentPath && node.target === path[index + 1]) {
            distance += node.distance;
          }
        });
      });

      response.path = path;
      response.distance = distance;
    }

    return response;
  }
}

export default SearchMinDistanceImplementation;
