import Graph from '../../../../graph/infra/typeorm/entities/Graph';
import IResponseSearchRoutes from '../../../infra/contracts/IResponseSearchRoutes';

interface ISearchRoutes {
  search(
    graph: Graph,
    town1: string,
    town2: string,
    maxStops: number,
  ): Promise<IResponseSearchRoutes>;
}

export default ISearchRoutes;
