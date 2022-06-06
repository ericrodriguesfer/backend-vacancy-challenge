import {
  ClassSerializerInterceptor,
  Controller,
  Param,
  Post,
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
  ApiTags,
} from '@nestjs/swagger';
import GetMinDistanceService from '../../services/GetMinDistance.service';
import IResponseGetMinDistanceDTO from '../contracts/IResponseGetMinDistanceDTO';

@ApiTags('distance')
@Controller('distance')
class DistanceController {
  constructor(private getMinDistanceService: GetMinDistanceService) {}

  @Post(':id/from/:town1/to/:town2')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'This route searches the minimum route in between two towns.',
  })
  @ApiOkResponse({
    description: 'Returnig the smaller route found.',
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
  async getMinDistance(
    @Param('id') id: number,
    @Param('town1') town1: string,
    @Param('town2') town2: string,
  ): Promise<IResponseGetMinDistanceDTO> {
    return this.getMinDistanceService.execute({ id, town1, town2 });
  }
}

export default DistanceController;
