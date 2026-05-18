import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { StudentModel } from '../../../../students/infrastructure/database/models/student.model';

@Table({ tableName: 'classrooms', timestamps: true })
export class ClassRoomModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: new Date().getFullYear() })
  declare year: number;

  @Column({ type: DataType.ENUM('MANHA', 'TARDE', 'NOITE'), defaultValue: 'MANHA' })
  declare shift: string;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare grade: number;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare startTime: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare breakStartTime: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare breakEndTime: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare endTime: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => StudentModel)
  declare students: StudentModel[];
}
