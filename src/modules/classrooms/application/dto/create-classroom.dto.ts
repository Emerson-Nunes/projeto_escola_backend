import { IsEnum, IsIn, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClassRoomDto {
  @ApiProperty({ example: '1º A' })
  @IsString()
  @MaxLength(100)
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

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  startTime?: string;

  @ApiPropertyOptional({ example: '09:30' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  breakStartTime?: string;

  @ApiPropertyOptional({ example: '09:50' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  breakEndTime?: string;

  @ApiPropertyOptional({ example: '12:00' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  endTime?: string;
}
