import { IsEnum, IsIn, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClassRoomDto {
  @ApiProperty({ example: '1º A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2024 })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ enum: ['MANHA', 'TARDE', 'NOITE'] })
  @IsEnum(['MANHA', 'TARDE', 'NOITE'])
  shift: string;

  @ApiProperty({ example: 1 })
  @IsIn([1, 2, 3])
  @Type(() => Number)
  grade: number;
}
