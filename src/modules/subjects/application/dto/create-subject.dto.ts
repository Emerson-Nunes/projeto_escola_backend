import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Matemática' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'MAT-M' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  workload?: number;

  @ApiPropertyOptional({ example: 'MANHA', enum: ['MANHA', 'TARDE', ''] })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  shift?: string;
}
