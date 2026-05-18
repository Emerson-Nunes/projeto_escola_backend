import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'notifications', timestamps: true })
export class NotificationModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare message: string;

  @Column({ type: DataType.UUID })
  declare senderUserId: string;

  @Column({ type: DataType.STRING })
  declare senderName: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  declare targetRoles: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  declare expiresAt: Date | null;
}
