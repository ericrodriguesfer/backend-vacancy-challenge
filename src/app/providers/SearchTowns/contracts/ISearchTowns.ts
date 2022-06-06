import Graph from '../../../../modules/graph/infra/typeorm/entities/Graph';

interface ISearchTowns {
  execute(graph: Graph, town1: string, town2: string): Promise<boolean>;
}

export default ISearchTowns;
