import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Graph from '../../../src/modules/graph/infra/typeorm/entities/Graph';
import CreateGraphService from '../../../src/modules/graph/services/CreateGraph.service';
import { graphRepository } from './mocks/CreateGraphMock';

describe('Testing the functions of create graphs', () => {
  let createGraphService: CreateGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGraphService,
        {
          provide: getRepositoryToken(Graph),
          useValue: graphRepository,
        },
      ],
    }).compile();

    createGraphService = module.get<CreateGraphService>(CreateGraphService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Should be able defined create graph service', async () => {
    expect(createGraphService).toBeDefined();
  });

  it('Should be able create a directed graph', async () => {
    const graphInputMock: Omit<Graph, 'id' | 'created_at' | 'updated_at'> = {
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };

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

    graphRepository.create.mockReturnValue(Promise.resolve(graphOutputMock));
    graphRepository.save.mockReturnValue(Promise.resolve(graphOutputMock));

    const response = await createGraphService.execute({
      data: graphInputMock.data,
    });

    expect(response).toEqual(graphOutputMock);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('data');
    expect(response.id).toBe(1);
    expect(response.data).toStrictEqual(graphInputMock.data);
    expect(graphRepository.create).toHaveBeenCalled();
    expect(graphRepository.save).toHaveBeenCalled();
    expect(graphRepository.create).toHaveBeenCalledTimes(1);
    expect(graphRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should not be able create a directed graph because ocurred server exception', async () => {
    const graphInputMock: Omit<Graph, 'id' | 'created_at' | 'updated_at'> = {
      data: [
        { source: 'A', target: 'B', distance: 2 },
        { source: 'A', target: 'E', distance: 3 },
        { source: 'B', target: 'C', distance: 2 },
        { source: 'C', target: 'D', distance: 1 },
        { source: 'C', target: 'E', distance: 3 },
        { source: 'E', target: 'D', distance: 2 },
      ],
    };

    graphRepository.create.mockReturnValue(Promise.reject());

    expect(
      createGraphService.execute({
        data: graphInputMock.data,
      }),
    ).rejects.toEqual(
      new InternalServerErrorException(
        'Internal server error, please try again',
      ),
    );
    expect(graphRepository.create).toHaveBeenCalled();
    expect(graphRepository.save).not.toHaveBeenCalled();
    expect(graphRepository.create).toHaveBeenCalledTimes(1);
    expect(graphRepository.save).toHaveBeenCalledTimes(0);
  });
});
