import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'school_config', timestamps: true })
export class SchoolConfigModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, defaultValue: 'Escola' })
  declare schoolName: string;

  @Column({ type: DataType.FLOAT, defaultValue: 7.0 })
  declare approvalAverage: number;

  @Column({ type: DataType.FLOAT, defaultValue: 4.0 })
  declare recoveryAverage: number;

  @Column({ type: DataType.INTEGER, defaultValue: new Date().getFullYear() })
  declare currentYear: number;
}
