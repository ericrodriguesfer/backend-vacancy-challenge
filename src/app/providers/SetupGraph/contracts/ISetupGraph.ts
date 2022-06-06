import { DirectedGraph } from 'graphology';
import Graph from '../../../../modules/graph/infra/typeorm/entities/Graph';

interface ISetupGraph {
  execute(graph: Graph): Promise<DirectedGraph>;
}

export default ISetupGraph;
