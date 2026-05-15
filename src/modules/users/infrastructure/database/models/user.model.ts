import { Column, Model, Table, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../../../shared/enums/role.enum';

@Table({ tableName: 'users', timestamps: true })
export class UserModel extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.ALUNO,
  })
  declare role: Role;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: UserModel) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
