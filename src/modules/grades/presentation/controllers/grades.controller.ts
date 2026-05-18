import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { GradesService } from '../../application/services/grades.service';
import { UpsertGradeDto } from '../../application/dto/upsert-grade.dto';
import { BulkUpsertGradesDto } from '../../application/dto/bulk-upsert-grades.dto';

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Get('valid-years')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Anos letivos com notas cadastradas' })
  getValidYears() {
    return this.service.getValidYears();
  }

  @Get('valid-years/classroom/:classRoomId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Anos letivos com notas para a turma' })
  getValidYearsForClassroom(@Param('classRoomId') classRoomId: string) {
    return this.service.getValidYearsForClassroom(classRoomId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Lançar ou atualizar nota' })
  upsert(@Body() dto: UpsertGradeDto) {
    return this.service.upsertGrade(dto);
  }

  @Post('bulk')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Lançar ou atualizar notas em lote' })
  bulkUpsert(@Body() dto: BulkUpsertGradesDto) {
    return this.service.bulkUpsert(dto);
  }

  @Get('student/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Notas do aluno' })
  getStudentGrades(@Param('id') id: string) {
    return this.service.getStudentGrades(id);
  }

  @Get('student/:id/reportcard')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Boletim completo do aluno' })
  getReportCard(@Param('id') id: string) {
    return this.service.getReportCard(id);
  }

  @Get('classroom/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Notas da turma' })
  getClassroomGrades(@Param('id') id: string) {
    return this.service.getClassroomGrades(id);
  }
}
