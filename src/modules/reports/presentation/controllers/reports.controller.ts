import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { ReportsService } from '../../application/services/reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  // Legacy endpoints
  @Get('student/:id/pdf')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Gerar PDF do boletim do aluno (legado)' })
  async studentPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.service.generateStudentPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="boletim-${id}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('classroom/:id/grades/xlsx')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Gerar planilha de notas da turma (legado)' })
  async classroomGradesXlsx(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.service.generateGradesXlsx(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="notas-${id}.xlsx"`,
    });
    res.send(buffer);
  }

  // New endpoints matching frontend service calls

  @Get('report-card/:studentId')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Gerar PDF do boletim do aluno' })
  @ApiQuery({ name: 'schoolYear', required: false, type: Number })
  async reportCard(
    @Param('studentId') studentId: string,
    @Query('schoolYear') schoolYear: string,
    @Res() res: Response,
  ) {
    const year = schoolYear ? parseInt(schoolYear, 10) : new Date().getFullYear();
    const buffer = await this.service.generateReportCard(studentId, year);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="boletim-${studentId}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('class/:classroomId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Gerar PDF do relatório da turma' })
  @ApiQuery({ name: 'schoolYear', required: false, type: Number })
  async classReport(
    @Param('classroomId') classroomId: string,
    @Query('schoolYear') schoolYear: string,
    @Res() res: Response,
  ) {
    const year = schoolYear ? parseInt(schoolYear, 10) : new Date().getFullYear();
    const buffer = await this.service.generateClassReport(classroomId, year);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="turma-${classroomId}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('grades-sheet/:classroomId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Gerar planilha de notas da turma' })
  @ApiQuery({ name: 'schoolYear', required: false, type: Number })
  async gradesSheet(
    @Param('classroomId') classroomId: string,
    @Query('schoolYear') schoolYear: string,
    @Res() res: Response,
  ) {
    const year = schoolYear ? parseInt(schoolYear, 10) : new Date().getFullYear();
    const buffer = await this.service.generateGradesSheet(classroomId, year);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="notas-${classroomId}.xlsx"`,
    });
    res.send(buffer);
  }

  @Get('attendance-sheet')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Gerar planilha de frequência' })
  @ApiQuery({ name: 'classRoomId', required: true })
  @ApiQuery({ name: 'subjectId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async attendanceSheet(
    @Query('classRoomId') classRoomId: string,
    @Query('subjectId') subjectId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
  ) {
    const buffer = await this.service.generateAttendanceSheet(classRoomId, subjectId, startDate, endDate);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="frequencia-${classRoomId}.xlsx"`,
    });
    res.send(buffer);
  }

  @Get('student/:studentId/attendance')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Gerar PDF de frequência do aluno' })
  @ApiQuery({ name: 'schoolYear', required: false, type: Number })
  async studentAttendancePdf(
    @Param('studentId') studentId: string,
    @Query('schoolYear') schoolYear: string,
    @Res() res: Response,
  ) {
    const year = schoolYear ? parseInt(schoolYear, 10) : undefined;
    const buffer = await this.service.generateStudentAttendancePdf(studentId, year);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="frequencia-${studentId}.pdf"`,
    });
    res.send(buffer);
  }
}
