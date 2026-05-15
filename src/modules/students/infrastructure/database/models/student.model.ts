import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserModel } from '../../../../users/infrastructure/database/models/user.model';
import { ClassRoomModel } from '../../../../classrooms/infrastructure/database/models/classroom.model';

@Table({ tableName: 'students', timestamps: true })
export class StudentModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare cpf: string;

  @Column({ type: DataType.DATEONLY })
  declare birthDate: string;

  @Column({ type: DataType.STRING })
  declare phone: string;

  @Column({ type: DataType.TEXT })
  declare address: string;

  @Column({ type: DataType.STRING, unique: true })
  declare enrollmentNumber: string;

  @ForeignKey(() => ClassRoomModel)
  @Column({ type: DataType.UUID })
  declare classRoomId: string;

  @BelongsTo(() => ClassRoomModel)
  declare classRoom: ClassRoomModel;

  @Column({ type: DataType.UUID })
  declare guardianId: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
