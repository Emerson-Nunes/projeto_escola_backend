import { Column, Model, Table, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { UserModel } from '../../../../users/infrastructure/database/models/user.model';
import { SubjectModel } from '../../../../subjects/infrastructure/database/models/subject.model';
import { TeacherSubjectModel } from './teacher_subject.model';

@Table({ tableName: 'teachers', timestamps: true })
export class TeacherModel extends Model {
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

  @Column({ type: DataType.STRING })
  declare registration: string;

  @BelongsToMany(() => SubjectModel, () => TeacherSubjectModel)
  declare subjects: SubjectModel[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
