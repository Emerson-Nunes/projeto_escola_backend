import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GradeModel } from '../../infrastructure/database/models/grade.model';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../../../subjects/infrastructure/database/models/subject.model';
import { SchoolConfigModel } from '../../../school-config/infrastructure/database/models/school-config.model';
import { StudentStatus } from '../../../../shared/enums/status.enum';
import { BulkUpsertGradesDto } from '../dto/bulk-upsert-grades.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(GradeModel) private gradeModel: typeof GradeModel,
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
    @InjectModel(SubjectModel) private subjectModel: typeof SubjectModel,
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

    const [grades, allSubjects] = await Promise.all([
      this.gradeModel.findAll({
        where: { studentId },
        include: [{ model: SubjectModel }],
      }),
      this.subjectModel.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
    ]);

    const subjectMap = new Map<string, any>();
    for (const sub of allSubjects) {
      subjectMap.set((sub as any).id, { subject: sub, bimesters: [] });
    }

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
      if (b.length === 0) {
        return { ...entry, media1: null, media2: null, mediaFinal: null, status: null };
      }

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

  async bulkUpsert(dto: BulkUpsertGradesDto) {
    const results: GradeModel[] = [];
    for (const item of dto.grades) {
      const grade = await this.upsertGrade({
        studentId: item.studentId,
        subjectId: dto.subjectId,
        classRoomId: dto.classRoomId,
        schoolYear: dto.schoolYear,
        bimester: dto.bimester,
        value: item.value,
        recoveryValue: item.recoveryValue,
      });
      results.push(grade);
    }
    return results;
  }

  async getValidYears(): Promise<number[]> {
    const rows = await this.gradeModel.findAll({
      attributes: ['schoolYear'],
      group: ['schoolYear'],
      order: [['schoolYear', 'DESC']],
      raw: true,
    });
    return rows.map((r: any) => r.schoolYear);
  }

  async getValidYearsForClassroom(classRoomId: string): Promise<number[]> {
    const rows = await this.gradeModel.findAll({
      attributes: ['schoolYear'],
      where: { classRoomId },
      group: ['schoolYear'],
      order: [['schoolYear', 'DESC']],
      raw: true,
    });
    return rows.map((r: any) => r.schoolYear);
  }
}
