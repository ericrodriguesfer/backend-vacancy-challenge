import { Injectable } from '@nestjs/common';
import INode from '../../../../modules/graph/infra/contracts/INode';
import Graph from '../../../../modules/graph/infra/typeorm/entities/Graph';
import ISearchTowns from '../contracts/ISearchTowns';

@Injectable()
class SearchTownsImplementations implements ISearchTowns {
  public async execute(
    graph: Graph,
    town1: string,
    town2: string,
  ): Promise<boolean> {
    let townsSource: Array<string> = [];

    graph.data.forEach((node: INode) => {
      townsSource.push(node.source.toUpperCase());
      townsSource.push(node.target.toUpperCase());
    });

    townsSource = townsSource.filter((town: string, index: number) => {
      return townsSource.indexOf(town) === index;
    });

    const searchTown1: string = townsSource.find((town) => town === town1);
    const searchTown2: string = townsSource.find((town) => town === town2);

    return !searchTown1 || !searchTown2 ? false : true;
  }
}

export default SearchTownsImplementations;
