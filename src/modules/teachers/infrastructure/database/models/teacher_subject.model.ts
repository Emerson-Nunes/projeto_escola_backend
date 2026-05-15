import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { TeacherModel } from './teacher.model';
import { SubjectModel } from '../../../../subjects/infrastructure/database/models/subject.model';

@Table({ tableName: 'teacher_subjects', timestamps: false })
export class TeacherSubjectModel extends Model {
  @ForeignKey(() => TeacherModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare teacherId: string;

  @ForeignKey(() => SubjectModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare subjectId: string;
}
