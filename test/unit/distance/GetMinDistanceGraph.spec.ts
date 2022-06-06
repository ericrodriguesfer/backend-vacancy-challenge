import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import SearchTownsImplementations from '../../../src/app/providers/SearchTowns/implementations/SearchTownsImplementations';
import IResponseGetMinDistanceDTO from '../../../src/modules/distance/infra/contracts/IResponseGetMinDistanceDTO';
import SearchMinDistanceImplementation from '../../../src/modules/distance/providers/SearchMinDistance/implementations/SearchMinDistanceImplementation';
import GetMinDistanceService from '../../../src/modules/distance/services/GetMinDistance.service';
import Graph from '../../../src/modules/graph/infra/typeorm/entities/Graph';
import {
  graphRepositoryMockup,
  searchMinDistanceMockup,
  searchTownsMockup,
} from './mocks/GetMinDistanceGraphMock';

describe('Testing the functions of calculate of minimal distance between two towns on graph', () => {
  let getMinDistanceService: GetMinDistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMinDistanceService,
        {
          provide: getRepositoryToken(Graph),
          useValue: graphRepositoryMockup,
        },
        {
          provide: SearchMinDistanceImplementation,
          useValue: searchMinDistanceMockup,
        },
        {
          provide: SearchTownsImplementations,
          useValue: searchTownsMockup,
        },
      ],
    }).compile();

    getMinDistanceService = module.get<GetMinDistanceService>(
      GetMinDistanceService,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined get min distance graph service', async () => {
    expect(getMinDistanceService).toBeDefined();
  });

  it('should be able get the minimal distance between two towns in a graph', async () => {
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
    const responseExpectedOutput: IResponseGetMinDistanceDTO = {
      distance: 3,
      path: ['B', 'C', 'D'],
    };
    const town1 = 'B';
    const town2 = 'D';

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(true));
    searchMinDistanceMockup.search.mockReturnValueOnce(
      Promise.resolve(responseExpectedOutput),
    );

    const response = await getMinDistanceService.execute({
      id: 1,
      town1,
      town2,
    });

    expect(response).toEqual(responseExpectedOutput);
    expect(response).toHaveProperty('distance');
    expect(response).toHaveProperty('path');
    expect(response.distance).toBe(3);
    expect(response.path).toStrictEqual(['B', 'C', 'D']);
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).toHaveBeenCalled();
    expect(searchMinDistanceMockup.search).toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(1);
    expect(searchMinDistanceMockup.search).toHaveBeenCalledTimes(1);
  });

  it('should be able get the minimal distance between two equals towns in a graph', async () => {
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
    const responseExpectedOutput: IResponseGetMinDistanceDTO = {
      distance: 0,
      path: [],
    };
    const town1 = 'B';
    const town2 = 'B';

    graphRepositoryMockup.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );
    searchTownsMockup.execute.mockReturnValueOnce(Promise.resolve(true));

    const response = await getMinDistanceService.execute({
      id: 1,
      town1,
      town2,
    });

    expect(response).toEqual(responseExpectedOutput);
    expect(response).toHaveProperty('distance');
    expect(response).toHaveProperty('path');
    expect(response.distance).toBe(0);
    expect(response.path).toStrictEqual([]);
    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).toHaveBeenCalled();
    expect(searchMinDistanceMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(1);
    expect(searchMinDistanceMockup.search).toHaveBeenCalledTimes(0);
  });

  it('should not be able get the minimal distance when the towns does not exists in graph', async () => {
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
      getMinDistanceService.execute({
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
    expect(searchMinDistanceMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchMinDistanceMockup.search).toHaveBeenCalledTimes(0);
  });

  it('should not be able get the minimal distance when the graph does not exists in database', async () => {
    const town1 = 'B';
    const town2 = 'J';

    graphRepositoryMockup.findOne.mockReturnValueOnce(Promise.resolve());

    expect(
      getMinDistanceService.execute({
        id: 1,
        town1,
        town2,
      }),
    ).rejects.toEqual(
      new ConflictException(
        'This graph solicited does not exists in our database',
      ),
    );

    expect(graphRepositoryMockup.findOne).toHaveBeenCalled();
    expect(searchTownsMockup.execute).not.toHaveBeenCalled();
    expect(searchMinDistanceMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchMinDistanceMockup.search).toHaveBeenCalledTimes(0);
  });

  it('should not be able get the minimal distance because ocurred server exception', async () => {
    const town1 = 'B';
    const town2 = 'J';

    graphRepositoryMockup.findOne.mockReturnValueOnce(Promise.reject());

    expect(
      getMinDistanceService.execute({
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
    expect(searchMinDistanceMockup.search).not.toHaveBeenCalled();
    expect(graphRepositoryMockup.findOne).toHaveBeenCalledTimes(1);
    expect(searchTownsMockup.execute).toHaveBeenCalledTimes(0);
    expect(searchMinDistanceMockup.search).toHaveBeenCalledTimes(0);
  });
});
