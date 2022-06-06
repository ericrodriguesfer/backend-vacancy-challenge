import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import SearchRoutesService from '../../services/SearchRoutes.service';
import IResponseSearchRoutes from '../contracts/IResponseSearchRoutes';

@ApiTags('routes')
@Controller('routes')
class RoutesController {
  constructor(private searchRouteService: SearchRoutesService) {}

  @Post(':id/from/:town1/to/:town2')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'maxStops', required: false })
  @ApiOperation({
    summary:
      'This route searches all paths exists in between two towns given away a number limit of stops.',
  })
  @ApiOkResponse({
    description: 'Returnig all paths found.',
  })
  @ApiNotFoundResponse({
    description: 'This graph solicited not found.',
  })
  @ApiConflictResponse({
    description: 'A of the two towns repassed does not belonge in graph.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error, please try again.',
  })
  async searchRoutes(
    @Param('id') id: number,
    @Param('town1') town1: string,
    @Param('town2') town2: string,
    @Query('maxStops', new DefaultValuePipe(-1), ParseIntPipe) maxStops = -1,
  ): Promise<IResponseSearchRoutes> {
    return await this.searchRouteService.execute({
      id,
      town1,
      town2,
      maxStops,
    });
  }
}

export default RoutesController;
