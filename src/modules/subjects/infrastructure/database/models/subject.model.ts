import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'subjects', timestamps: true })
export class SubjectModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 80 })
  declare workload: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
