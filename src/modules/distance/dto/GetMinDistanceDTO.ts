import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

class GetMinDistanceDTO {
  @IsInt({ message: 'This id variable need to be a number' })
  @IsNotEmpty({ message: 'This id variable can not empty' })
  @ApiProperty()
  id: number;

  @IsString({ message: 'This town1 variable need to be a string' })
  @IsNotEmpty({ message: 'This town1 variable can not empty' })
  @ApiProperty()
  town1: string;

  @IsString({ message: 'This town1 variable need to be a string' })
  @IsNotEmpty({ message: 'This town1 variable can not empty' })
  @ApiProperty()
  town2: string;
}

export default GetMinDistanceDTO;
