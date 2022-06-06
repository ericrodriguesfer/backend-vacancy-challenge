import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

class GetGraphDTO {
  @IsInt({ message: 'This id variable need to be a number' })
  @IsNotEmpty({ message: 'This id variable can not empty' })
  @ApiProperty()
  id: number;
}

export default GetGraphDTO;
