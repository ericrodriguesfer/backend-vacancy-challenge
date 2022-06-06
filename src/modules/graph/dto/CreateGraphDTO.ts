import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import Node from '../infra/contracts/INode';

class CreateGraphDTO {
  @IsArray({ message: 'This data variable need to be a array' })
  @IsNotEmpty({ message: 'This data variable can not empty' })
  @ApiProperty()
  data: Array<Node>;
}

export default CreateGraphDTO;
