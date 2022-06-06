import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Node from '../../contracts/INode';

@Entity('graph')
class Graph {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: number;

  @Column({ type: 'text', array: true, default: [] })
  @ApiProperty()
  data: Node[];
}

export default Graph;
