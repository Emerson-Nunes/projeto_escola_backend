import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { escapeLike } from '../../../../shared/utils/escape-like.util';
import { GuardianModel } from '../../infrastructure/database/models/guardian.model';
import { UserModel } from '../../../users/infrastructure/database/models/user.model';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { Role } from '../../../../shared/enums/role.enum';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectModel(GuardianModel) private guardianModel: typeof GuardianModel,
    @InjectModel(UserModel) private userModel: typeof UserModel,
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
  ) {}

  async create(dto: any) {
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: dto.password || 'Temp@123',
      role: Role.RESPONSAVEL,
    } as any);
    return this.guardianModel.create({
      userId: (user as any).id,
      name: dto.name,
      cpf: dto.cpf,
      phone: dto.phone,
      email: dto.email,
      relationship: dto.relationship,
    } as any);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };

    const { rows, count } = await this.guardianModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const g = await this.guardianModel.findByPk(id);
    if (!g) throw new NotFoundException('Responsável não encontrado');
    return g;
  }

  async findByUserId(userId: string) {
    const g = await this.guardianModel.findOne({ where: { userId } });
    if (!g) throw new NotFoundException('Responsável não encontrado');
    const students = await this.studentModel.findAll({ where: { guardianId: (g as any).id } });
    return { ...(g as any).toJSON(), students };
  }

  async getStudents(id: string) {
    return this.studentModel.findAll({ where: { guardianId: id } });
  }

  async update(id: string, dto: any) {
    const g = await this.findOne(id);
    await g.update(dto);
    return g;
  }
}
