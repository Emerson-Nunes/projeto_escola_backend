import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as ExcelJS from 'exceljs';
import { GradesService } from '../../../grades/application/services/grades.service';
import { AttendanceService } from '../../../attendance/application/services/attendance.service';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { ClassRoomModel } from '../../../classrooms/infrastructure/database/models/classroom.model';

@Injectable()
export class ReportsService {
  constructor(
    private gradesService: GradesService,
    private attendanceService: AttendanceService,
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
    @InjectModel(ClassRoomModel) private classRoomModel: typeof ClassRoomModel,
  ) {}

  async generateStudentPdf(studentId: string): Promise<Buffer> {
    const reportCard = await this.gradesService.getReportCard(studentId);
    const student = (reportCard as any).student;
    const subjects = (reportCard as any).subjects;

    let content = `BOLETIM ESCOLAR\n`;
    content += `================\n`;
    content += `Aluno: ${student?.name || studentId}\n\n`;

    for (const entry of subjects || []) {
      content += `${entry.subject?.name}: Media1=${entry.media1?.toFixed(1) ?? '-'} | Media2=${entry.media2?.toFixed(1) ?? '-'} | Final=${entry.mediaFinal?.toFixed(1) ?? '-'} | Status=${entry.status ?? '-'}\n`;
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

  // TASK 2: New report methods

  async generateReportCard(studentId: string, schoolYear: number): Promise<Buffer> {
    const reportCard = await this.gradesService.getReportCard(studentId);
    const student = (reportCard as any).student;
    const subjects = (reportCard as any).subjects;
    const approvalAverage = (reportCard as any).approvalAverage;
    const recoveryAverage = (reportCard as any).recoveryAverage;

    let content = `BOLETIM ESCOLAR\n`;
    content += `${'='.repeat(60)}\n`;
    content += `Aluno: ${student?.name || studentId}\n`;
    content += `Ano Letivo: ${schoolYear}\n`;
    content += `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `Média de Aprovação: ${approvalAverage} | Média de Recuperação: ${recoveryAverage}\n`;
    content += `${'='.repeat(60)}\n\n`;

    content += `${'Disciplina'.padEnd(30)} ${'1Bi'.padStart(5)} ${'2Bi'.padStart(5)} ${'Med1'.padStart(5)} ${'3Bi'.padStart(5)} ${'4Bi'.padStart(5)} ${'Med2'.padStart(5)} ${'Final'.padStart(5)} ${'Status'.padStart(12)}\n`;
    content += `${'-'.repeat(90)}\n`;

    for (const entry of subjects || []) {
      const name = (entry.subject?.name || '').substring(0, 30).padEnd(30);
      const b = entry.bimesters || [];
      const get = (n: number) => {
        const found = b.find((x: any) => x.bimester === n);
        return found ? found.finalValue?.toFixed(1) : '-';
      };
      const media1 = entry.media1 != null ? entry.media1.toFixed(1) : '-';
      const media2 = entry.media2 != null ? entry.media2.toFixed(1) : '-';
      const mediaFinal = entry.mediaFinal != null ? entry.mediaFinal.toFixed(1) : '-';
      const status = entry.status || '-';

      content += `${name} ${get(1).padStart(5)} ${get(2).padStart(5)} ${media1.padStart(5)} ${get(3).padStart(5)} ${get(4).padStart(5)} ${media2.padStart(5)} ${mediaFinal.padStart(5)} ${status.padStart(12)}\n`;
    }

    return Buffer.from(content, 'utf-8');
  }

  async generateClassReport(classRoomId: string, schoolYear: number): Promise<Buffer> {
    const classroom = await this.classRoomModel.findByPk(classRoomId);
    const students = await this.studentModel.findAll({ where: { classRoomId } });

    let content = `RELATÓRIO DE TURMA\n`;
    content += `${'='.repeat(60)}\n`;
    content += `Turma: ${(classroom as any)?.name || classRoomId}\n`;
    content += `Ano Letivo: ${schoolYear}\n`;
    content += `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `Total de Alunos: ${students.length}\n`;
    content += `${'='.repeat(60)}\n\n`;

    for (const student of students) {
      const reportCard = await this.gradesService.getReportCard((student as any).id);
      const subjects = (reportCard as any).subjects || [];

      content += `\nAluno: ${(student as any).name}\n`;
      content += `${'-'.repeat(50)}\n`;

      for (const entry of subjects) {
        if (entry.mediaFinal == null) continue;
        content += `  ${(entry.subject?.name || '').padEnd(30)} Final: ${entry.mediaFinal.toFixed(1).padStart(4)} | ${entry.status || '-'}\n`;
      }
    }

    return Buffer.from(content, 'utf-8');
  }

  async generateGradesSheet(classRoomId: string, schoolYear: number): Promise<Buffer> {
    const grades = await this.gradesService.getClassroomGrades(classRoomId);
    const filtered = (grades as any[]).filter((g) => g.schoolYear === schoolYear);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Notas');

    sheet.addRow(['Aluno', 'Disciplina', 'Bimestre', 'Nota', 'Recuperação', 'Final', 'Ano']);
    sheet.getRow(1).font = { bold: true };

    for (const g of filtered) {
      sheet.addRow([
        g.student?.name || g.studentId,
        g.subject?.name || g.subjectId,
        g.bimester,
        g.value,
        g.recoveryValue || '',
        g.finalBimesterValue,
        g.schoolYear,
      ]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generateAttendanceSheet(
    classRoomId: string,
    subjectId: string,
    startDate: string,
    endDate: string,
  ): Promise<Buffer> {
    const records = await this.attendanceService.getClassroomAttendance(classRoomId);

    const filtered = (records as any[]).filter((r) => {
      const dateMatch = r.date >= startDate && r.date <= endDate;
      const subjectMatch = !subjectId || r.subjectId === subjectId;
      return dateMatch && subjectMatch;
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Frequência');

    sheet.addRow(['Aluno', 'Disciplina', 'Data', 'Presente', 'Justificado', 'Justificativa']);
    sheet.getRow(1).font = { bold: true };

    for (const r of filtered) {
      sheet.addRow([
        r.student?.name || r.studentId,
        r.subject?.name || r.subjectId,
        r.date,
        r.present ? 'Sim' : 'Não',
        r.justified ? 'Sim' : 'Não',
        r.justification || '',
      ]);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async generateStudentAttendancePdf(studentId: string, schoolYear?: number): Promise<Buffer> {
    const student = await this.studentModel.findByPk(studentId);
    const attendance = await this.attendanceService.getStudentAttendance(studentId);
    const { records, total, present, absent, percentage } = attendance as any;

    let content = `RELATÓRIO DE FREQUÊNCIA\n`;
    content += `${'='.repeat(60)}\n`;
    content += `Aluno: ${(student as any)?.name || studentId}\n`;
    if (schoolYear) content += `Ano Letivo: ${schoolYear}\n`;
    content += `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}\n`;
    content += `${'='.repeat(60)}\n\n`;
    content += `Total de Aulas: ${total}\n`;
    content += `Presenças: ${present}\n`;
    content += `Faltas: ${absent}\n`;
    content += `Frequência: ${percentage}%\n\n`;

    const absences = (records as any[]).filter((r) => !r.present);
    if (absences.length > 0) {
      content += `REGISTRO DE FALTAS\n`;
      content += `${'-'.repeat(60)}\n`;
      for (const r of absences) {
        const subjectName = r.subject?.name || r.subjectId;
        const justified = r.justified ? ' (Justificado)' : '';
        content += `  ${r.date}  ${subjectName}${justified}\n`;
        if (r.justification) content += `    Justificativa: ${r.justification}\n`;
      }
    }

    return Buffer.from(content, 'utf-8');
  }
}
