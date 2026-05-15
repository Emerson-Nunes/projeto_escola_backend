import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GradeModel } from '../../infrastructure/database/models/grade.model';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../../../subjects/infrastructure/database/models/subject.model';
import { SchoolConfigModel } from '../../../school-config/infrastructure/database/models/school-config.model';
import { StudentStatus } from '../../../../shared/enums/status.enum';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(GradeModel) private gradeModel: typeof GradeModel,
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
    @InjectModel(SchoolConfigModel) private configModel: typeof SchoolConfigModel,
  ) {}

  private calcFinalBimester(value: number, recovery?: number): number {
    if (recovery != null && recovery > value) return recovery;
    return value;
  }

  async upsertGrade(dto: {
    studentId: string;
    subjectId: string;
    classRoomId: string;
    schoolYear: number;
    bimester: number;
    value: number;
    recoveryValue?: number;
  }) {
    const finalBimesterValue = this.calcFinalBimester(dto.value, dto.recoveryValue);

    const existing = await this.gradeModel.findOne({
      where: {
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        bimester: dto.bimester,
        schoolYear: dto.schoolYear,
      },
    });

    if (existing) {
      await existing.update({ value: dto.value, recoveryValue: dto.recoveryValue, finalBimesterValue });
      return existing;
    }

    return this.gradeModel.create({ ...dto, finalBimesterValue } as any);
  }

  async getStudentGrades(studentId: string) {
    return this.gradeModel.findAll({
      where: { studentId },
      include: [{ model: SubjectModel }],
      order: [['bimester', 'ASC']],
    });
  }

  async getReportCard(studentId: string) {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    const config = await this.configModel.findOne();
    const approvalAvg = (config as any)?.approvalAverage ?? 7;
    const recoveryAvg = (config as any)?.recoveryAverage ?? 4;

    const grades = await this.gradeModel.findAll({
      where: { studentId },
      include: [{ model: SubjectModel }],
    });

    const subjectMap = new Map<string, any>();
    for (const g of grades) {
      const sid = (g as any).subjectId;
      if (!subjectMap.has(sid)) {
        subjectMap.set(sid, { subject: (g as any).subject, bimesters: [] });
      }
      subjectMap.get(sid).bimesters.push({
        bimester: (g as any).bimester,
        value: (g as any).value,
        recoveryValue: (g as any).recoveryValue,
        finalValue: (g as any).finalBimesterValue,
      });
    }

    const subjects = Array.from(subjectMap.values()).map((entry) => {
      const b = entry.bimesters;
      const get = (n: number) => b.find((x: any) => x.bimester === n)?.finalValue ?? 0;
      const media1 = (get(1) + get(2)) / 2;
      const media2 = (get(3) + get(4)) / 2;
      const mediaFinal = (media1 + media2) / 2;

      let status: StudentStatus;
      if (mediaFinal >= approvalAvg) status = StudentStatus.APROVADO;
      else if (mediaFinal >= recoveryAvg) status = StudentStatus.RECUPERACAO;
      else status = StudentStatus.REPROVADO;

      return { ...entry, media1, media2, mediaFinal, status };
    });

    return { student, subjects, approvalAverage: approvalAvg, recoveryAverage: recoveryAvg };
  }

  async getClassroomGrades(classRoomId: string) {
    return this.gradeModel.findAll({
      where: { classRoomId },
      include: [{ model: StudentModel }, { model: SubjectModel }],
    });
  }
}
