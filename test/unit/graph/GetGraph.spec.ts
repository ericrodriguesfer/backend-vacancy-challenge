import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Graph from '../../../src/modules/graph/infra/typeorm/entities/Graph';
import GetGraphService from '../../../src/modules/graph/services/GetGraph.service';
import { graphRepository } from './mocks/GetGraphMock';

describe('Testing the functions of get graphs', () => {
  let getGraphService: GetGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetGraphService,
        {
          provide: getRepositoryToken(Graph),
          useValue: graphRepository,
        },
      ],
    }).compile();

    getGraphService = module.get<GetGraphService>(GetGraphService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined get graph service', async () => {
    expect(getGraphService).toBeDefined();
  });

  it('Should be able get a directed graph existings in database', async () => {
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

    graphRepository.findOne.mockReturnValueOnce(
      Promise.resolve(graphOutputMock),
    );

    const response = await getGraphService.execute({ id: 1 });

    expect(response).toEqual(graphOutputMock);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('data');
    expect(response.id).toBe(1);
    expect(response.data).toStrictEqual(graphOutputMock.data);
    expect(graphRepository.findOne).toHaveBeenCalled();
    expect(graphRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should not be able get a directed graph because ocurred server exception', async () => {
    graphRepository.findOne.mockReturnValueOnce(Promise.resolve());

    expect(getGraphService.execute({ id: 1 })).rejects.toEqual(
      new NotFoundException(
        'This graph solicited does not exists in our database',
      ),
    );
    expect(graphRepository.findOne).toHaveBeenCalled();
    expect(graphRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('Should not be able get a directed graph when the graph does not exists in database', async () => {
    graphRepository.findOne.mockReturnValueOnce(Promise.reject());

    expect(getGraphService.execute({ id: 1 })).rejects.toEqual(
      new InternalServerErrorException(
        'Internal server error, please try again',
      ),
    );
    expect(graphRepository.findOne).toHaveBeenCalled();
    expect(graphRepository.findOne).toHaveBeenCalledTimes(1);
  });
});
