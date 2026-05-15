import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { StudentModel } from '../../../../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../../../../subjects/infrastructure/database/models/subject.model';

@Table({ tableName: 'attendance', timestamps: true })
export class AttendanceModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => StudentModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare studentId: string;

  @BelongsTo(() => StudentModel)
  declare student: StudentModel;

  @ForeignKey(() => SubjectModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare subjectId: string;

  @BelongsTo(() => SubjectModel)
  declare subject: SubjectModel;

  @Column({ type: DataType.UUID, allowNull: false })
  declare classRoomId: string;

  @Column({ type: DataType.UUID })
  declare teacherId: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare present: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare justified: boolean;

  @Column({ type: DataType.TEXT })
  declare justification: string;
}
