import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import CreateGraphDTO from '../../dto/CreateGraphDTO';
import CreateGraphService from '../../services/CreateGraph.service';
import GetGraphService from '../../services/GetGraph.service';
import Graph from '../typeorm/entities/Graph';

@ApiTags('graph')
@Controller('graph')
class GraphController {
  constructor(
    private createGraphService: CreateGraphService,
    private getGraphService: GetGraphService,
  ) {}

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'This route searches for a requested graph.',
  })
  @ApiOkResponse({
    description: 'Returnig the graph found.',
    type: Graph,
  })
  @ApiNotFoundResponse({
    description: 'This graph solicited not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error, please try again.',
  })
  async getGraph(@Param('id') id: number): Promise<Graph> {
    return this.getGraphService.execute({ id });
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'This route create a graph in our database.',
  })
  @ApiOkResponse({
    description: 'Graph created with success in database.',
    type: Graph,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error, please try again.',
  })
  async createGraph(@Body() { data }: CreateGraphDTO): Promise<Graph> {
    return this.createGraphService.execute({ data });
  }
}

export default GraphController;
