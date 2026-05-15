import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { UserModel } from '../../../../users/infrastructure/database/models/user.model';

@Table({ tableName: 'guardians', timestamps: true })
export class GuardianModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare cpf: string;

  @Column({ type: DataType.STRING })
  declare phone: string;

  @Column({ type: DataType.STRING })
  declare email: string;

  @Column({ type: DataType.STRING })
  declare relationship: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
