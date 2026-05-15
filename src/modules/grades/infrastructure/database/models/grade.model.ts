import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { StudentModel } from '../../../../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../../../../subjects/infrastructure/database/models/subject.model';
import { ClassRoomModel } from '../../../../classrooms/infrastructure/database/models/classroom.model';

@Table({ tableName: 'grades', timestamps: true })
export class GradeModel extends Model {
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

  @ForeignKey(() => ClassRoomModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare classRoomId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare schoolYear: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare bimester: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare value: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare recoveryValue: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  declare finalBimesterValue: number;
}
