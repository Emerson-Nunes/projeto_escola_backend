import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { AttendanceService } from '../../application/services/attendance.service';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post('bulk')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Registrar chamada em lote' })
  bulkCreate(@Body() records: any[]) {
    return this.service.bulkCreate(records);
  }

  @Get('student/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Frequência do aluno' })
  getStudentAttendance(@Param('id') id: string) {
    return this.service.getStudentAttendance(id);
  }

  @Get('classroom/:id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Frequência da turma' })
  getClassroomAttendance(@Param('id') id: string) {
    return this.service.getClassroomAttendance(id);
  }

  @Patch(':id/justify')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Justificar falta' })
  justify(@Param('id') id: string, @Body() dto: { justification: string }) {
    return this.service.justify(id, dto.justification);
  }
}
