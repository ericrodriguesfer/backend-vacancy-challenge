import { Injectable } from '@nestjs/common';
import { DirectedGraph } from 'graphology';
import INode from '../../../../modules/graph/infra/contracts/INode';
import Graph from '../../../../modules/graph/infra/typeorm/entities/Graph';
import ISetupGraph from '../contracts/ISetupGraph';

@Injectable()
class SetupGraphImplementations implements ISetupGraph {
  public async execute(graph: Graph): Promise<DirectedGraph> {
    let townsSource: Array<string> = [];

    graph.data.forEach((node: INode) => {
      townsSource.push(node.source.toUpperCase());
      townsSource.push(node.target.toUpperCase());
    });

    townsSource = townsSource.filter((town: string, index: number) => {
      return townsSource.indexOf(town) === index;
    });

    const graphMounted: DirectedGraph = new DirectedGraph();

    townsSource.forEach((town: string) => {
      graphMounted.addNode(town);
    });

    graph.data.forEach((node: INode) =>
      graphMounted.addEdge(
        node.source.toUpperCase(),
        node.target.toUpperCase(),
        {
          distance: node.distance,
        },
      ),
    );

    return graphMounted;
  }
}

export default SetupGraphImplementations;
