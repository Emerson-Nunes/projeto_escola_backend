import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { GradesService } from '../../application/services/grades.service';

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Lançar ou atualizar nota' })
  upsert(@Body() dto: any) {
    return this.service.upsertGrade(dto);
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
