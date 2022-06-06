import IResponseGetMinDistanceDTO from '../../../../../modules/distance/infra/contracts/IResponseGetMinDistanceDTO';
import Graph from '../../../../../modules/graph/infra/typeorm/entities/Graph';

interface ISearchMinDistance {
  search(
    graph: Graph,
    town1: string,
    town2: string,
  ): Promise<IResponseGetMinDistanceDTO>;
}

export default ISearchMinDistance;
