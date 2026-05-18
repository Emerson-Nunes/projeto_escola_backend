import { IsUUID, IsInt, IsNumber, IsOptional, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class GradeItemDto {
  @IsUUID()
  studentId: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  value: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  recoveryValue?: number;
}

export class BulkUpsertGradesDto {
  @IsUUID()
  classRoomId: string;

  @IsUUID()
  subjectId: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  schoolYear: number;

  @IsInt()
  @Min(1)
  @Max(4)
  bimester: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeItemDto)
  grades: GradeItemDto[];
}
