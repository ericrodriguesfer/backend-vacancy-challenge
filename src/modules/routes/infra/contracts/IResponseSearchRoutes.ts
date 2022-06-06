interface Route {
  route: string;
  stops: number;
}

interface IResponseSearchRoutes {
  routes: Array<Route>;
}

export default IResponseSearchRoutes;
