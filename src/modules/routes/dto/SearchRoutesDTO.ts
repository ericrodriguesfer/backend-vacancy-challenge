import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class SearchRoutesDTO {
  @IsInt({ message: 'This id variable need to be a number' })
  @IsNotEmpty({ message: 'This id variable can not empty' })
  @ApiProperty()
  id: number;

  @IsString({ message: 'This town1 variable need to be a string' })
  @IsNotEmpty({ message: 'This town1 variable can not empty' })
  @ApiProperty()
  town1: string;

  @IsString({ message: 'This town2 variable need to be a string' })
  @IsNotEmpty({ message: 'This town2 variable can not empty' })
  @ApiProperty()
  town2: string;

  @IsInt({ message: 'This maxStops variable need to be a number' })
  @IsOptional({ message: 'This maxStops variable is optional param' })
  @ApiProperty()
  maxStops?: number;
}

export default SearchRoutesDTO;
