import { IsUUID, IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpsertGradeDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  classRoomId: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  schoolYear: number;

  @IsInt()
  @Min(1)
  @Max(4)
  bimester: number;

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
