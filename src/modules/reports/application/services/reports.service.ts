import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { GradesService } from '../../../grades/application/services/grades.service';

@Injectable()
export class ReportsService {
  constructor(private gradesService: GradesService) {}

  async generateStudentPdf(studentId: string): Promise<Buffer> {
    const reportCard = await this.gradesService.getReportCard(studentId);
    const student = (reportCard as any).student;
    const subjects = (reportCard as any).subjects;

    let content = `BOLETIM ESCOLAR\n`;
    content += `================\n`;
    content += `Aluno: ${student?.name || studentId}\n\n`;

    for (const entry of subjects || []) {
      content += `${entry.subject?.name}: Media1=${entry.media1?.toFixed(1)} | Media2=${entry.media2?.toFixed(1)} | Final=${entry.mediaFinal?.toFixed(1)} | Status=${entry.status}\n`;
    }

    return Buffer.from(content, 'utf-8');
  }

  async generateGradesXlsx(classRoomId: string): Promise<Buffer> {
    const grades = await this.gradesService.getClassroomGrades(classRoomId);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Notas');

    sheet.addRow(['Aluno', 'Disciplina', 'Bimestre', 'Nota', 'Recuperação', 'Final']);
    sheet.getRow(1).font = { bold: true };

    for (const g of grades as any[]) {
      sheet.addRow([
        g.student?.name || g.studentId,
        g.subject?.name || g.subjectId,
        g.bimester,
        g.value,
        g.recoveryValue || '',
        g.finalBimesterValue,
      ]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
