import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AttendanceModel } from '../../infrastructure/database/models/attendance.model';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../../../subjects/infrastructure/database/models/subject.model';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceModel) private model: typeof AttendanceModel,
  ) {}

  async bulkCreate(records: any[]) {
    for (const r of records) {
      const existing = await this.model.findOne({
        where: { studentId: r.studentId, subjectId: r.subjectId, date: r.date },
      });
      if (existing) {
        await existing.update(r);
      } else {
        await this.model.create(r);
      }
    }
    return { message: `${records.length} registros salvos` };
  }

  async getStudentAttendance(studentId: string) {
    const records = await this.model.findAll({
      where: { studentId },
      include: [{ model: SubjectModel }],
      order: [['date', 'DESC']],
    });
    const total = records.length;
    const present = records.filter((r) => (r as any).present).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;
    return { records, total, present, absent: total - present, percentage };
  }

  async getClassroomAttendance(classRoomId: string) {
    return this.model.findAll({
      where: { classRoomId },
      include: [{ model: StudentModel }, { model: SubjectModel }],
      order: [['date', 'DESC']],
    });
  }

  async justify(id: string, justification: string) {
    const record = await this.model.findByPk(id);
    if (record) await record.update({ justified: true, justification });
    return record;
  }
}
