import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import SearchTownsImplementations from '../../../src/app/providers/SearchTowns/implementations/SearchTownsImplementations';
import Graph from '../../../src/modules/graph/infra/typeorm/entities/Graph';
import IResponseSearchRoutes from '../../../src/modules/routes/infra/contracts/IResponseSearchRoutes';
import SearchRoutesImplementations from '../../../src/modules/routes/providers/SearchRoutes/implementations/SearchRoutesImplementations';
import SearchRoutesService from '../../../src/modules/routes/services/SearchRoutes.service';
import {
  graphRepositoryMockup,
  searchRoutesMockup,
  searchTownsMockup,
} from './mocks/SearchRoutesMock';

describe('Testing the functions of search all routes between two towns on graph when have number maximum of stops or no', () => {
  let searchRoutesService: SearchRoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchRoutesService,
        {
          provide: getRepositoryToken(Graph),
          useValue: graphRepositoryMockup,
        },
        {
          provide: SearchRoutesImplementations,
          useValue: searchRoutesMockup,
        },
        {
          provide: SearchTownsImplementations,
          useValue: searchTownsMockup,
        },
      ],
    }).compile();

    searchRoutesService = module.get<SearchRoutesService>(SearchRoutesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined search routes graph service', async () => {
    expect(searchRoutesService).toBeDefined();
  });

  it('Should be able list all routes between two towns without maximal stops in a graph', async () => {
    const graphOutputMock: Graph = {
      id: 1,
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };
    const responseExpectedOutput: IResponseSearchRoutes = {
      routes: [
        { route: 'ABCD', stops: 3 },
        { route: 'AED', stops: 2 },
        { route: 'ABCED', stops: 4 },
      ],
    };
    const town1 = 'A';
    const town2 = 'D';

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(true));
    searchRoutesMockup.search.mockReturnValueOnce(
      Promise.resolve(responseExpectedOutput),
    );

    const response = await searchRoutesService.execute({ id: 1, town1, town2 });

    expect(response).toEqual(responseExpectedOutput);
    expect(response).toHaveProperty('routes');
    expect(response.routes).toHaveLength(3);
    expect(response.routes[0]).toHaveProperty('route');
    expect(response.routes[0]).toHaveProperty('stops');
    expect(response.routes).toStrictEqual([
      { route: 'ABCD', stops: 3 },
      { route: 'AED', stops: 2 },
      { route: 'ABCED', stops: 4 },
    ]);
    expect(response.routes[0]).toStrictEqual({ route: 'ABCD', stops: 3 });
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).toHaveBeenCalled();
    expect(searchRoutesMockup.search).toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(1);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(1);
  });

  it('Should be able list all routes between two towns with maximal stops equal three in a graph', async () => {
    const graphOutputMock: Graph = {
      id: 1,
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };
    const responseExpectedOutput: IResponseSearchRoutes = {
      routes: [
        { route: 'ABCD', stops: 3 },
        { route: 'AED', stops: 2 },
      ],
    };
    const town1 = 'A';
    const town2 = 'D';
    const maxStops = 3;

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(true));
    searchRoutesMockup.search.mockReturnValueOnce(
      Promise.resolve(responseExpectedOutput),
    );

    const response = await searchRoutesService.execute({
      id: 1,
      town1,
      town2,
      maxStops,
    });

    expect(response).toEqual(responseExpectedOutput);
    expect(response).toHaveProperty('routes');
    expect(response.routes).toHaveLength(2);
    expect(response.routes[0]).toHaveProperty('route');
    expect(response.routes[0]).toHaveProperty('stops');
    expect(response.routes).toStrictEqual([
      { route: 'ABCD', stops: 3 },
      { route: 'AED', stops: 2 },
    ]);
    expect(response.routes[0]).toStrictEqual({ route: 'ABCD', stops: 3 });
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).toHaveBeenCalled();
    expect(searchRoutesMockup.search).toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(1);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(1);
  });

  it('Should be able list all routes between two towns when thes equals in a graph', async () => {
    const graphOutputMock: Graph = {
      id: 1,
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };
    const responseExpectedOutput: IResponseSearchRoutes = {
      routes: [],
    };
    const town1 = 'B';
    const town2 = 'B';

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(true));
    searchRoutesMockup.search.mockReturnValueOnce(
      Promise.resolve(responseExpectedOutput),
    );

    const response = await searchRoutesService.execute({
      id: 1,
      town1,
      town2,
    });

    expect(response).toEqual(responseExpectedOutput);
    expect(response).toHaveProperty('routes');
    expect(response.routes).toHaveLength(0);
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).toHaveBeenCalled();
    expect(searchRoutesMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(1);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(0);
  });

  it('Should not be able list all routes between two towns because thes does not exists in graph', async () => {
    const graphOutputMock: Graph = {
      id: 1,
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };
    const town1 = 'B';
    const town2 = 'J';

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(false));

    expect(
      searchRoutesService.execute({
        id: 1,
        town1,
        town2,
      }),
    ).rejects.toEqual(
      new ConflictException(
        'A of the two towns passed on does not exist in this graph',
      ),
    );
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).not.toHaveBeenCalled();
    expect(searchRoutesMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(0);
  });

  it('Should not be able list all routes between two towns because the graph does not exists in database', async () => {
    const town1 = 'B';
    const town2 = 'D';

    graphRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());

    expect(
      searchRoutesService.execute({
        id: 1,
        town1,
        town2,
      }),
    ).rejects.toEqual(
      new NotFoundException(
        'This graph solicited does not exists in our database',
      ),
    );
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).not.toHaveBeenCalled();
    expect(searchRoutesMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(0);
  });

  it('Should not be able list all routes between two towns because ocurred server exception', async () => {
    const town1 = 'B';
    const town2 = 'D';

    graphRepositoryMockup.findOne.mockReturnValueOnce(Promise.reject());

    expect(
      searchRoutesService.execute({
        id: 1,
        town1,
        town2,
      }),
    ).rejects.toEqual(
      new InternalServerErrorException(
        'Internal server error, please try again',
      ),
    );
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).not.toHaveBeenCalled();
    expect(searchRoutesMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchRoutesMockup.search).toHaveBeenCalledTimes(0);
  });
});
