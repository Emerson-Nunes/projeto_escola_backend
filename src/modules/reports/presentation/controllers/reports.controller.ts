import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { ReportsService } from '../../application/services/reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('student/:id/pdf')
  @ApiOperation({ summary: 'Gerar PDF do boletim do aluno' })
  async studentPdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.service.generateStudentPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="boletim-${id}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('classroom/:id/grades/xlsx')
  @ApiOperation({ summary: 'Gerar planilha de notas da turma' })
  async classroomGradesXlsx(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.service.generateGradesXlsx(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="notas-${id}.xlsx"`,
    });
    res.send(buffer);
  }
}
