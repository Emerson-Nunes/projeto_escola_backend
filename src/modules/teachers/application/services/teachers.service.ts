import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { escapeLike } from '../../../../shared/utils/escape-like.util';
import { TeacherModel } from '../../infrastructure/database/models/teacher.model';
import { TeacherSubjectModel } from '../../infrastructure/database/models/teacher_subject.model';
import { UserModel } from '../../../users/infrastructure/database/models/user.model';
import { SubjectModel } from '../../../subjects/infrastructure/database/models/subject.model';
import { Role } from '../../../../shared/enums/role.enum';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(TeacherModel) private teacherModel: typeof TeacherModel,
    @InjectModel(UserModel) private userModel: typeof UserModel,
    @InjectModel(SubjectModel) private subjectModel: typeof SubjectModel,
    @InjectModel(TeacherSubjectModel) private teacherSubjectModel: typeof TeacherSubjectModel,
  ) {}

  async create(dto: any) {
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.PROFESSOR,
    } as any);

    const teacher = await this.teacherModel.create({
      userId: (user as any).id,
      name: dto.name,
      cpf: dto.cpf,
      birthDate: dto.birthDate,
      phone: dto.phone,
      registration: dto.registration || dto.registrationNumber,
    } as any);

    if (dto.subjectIds?.length) {
      await (teacher as any).$set('subjects', dto.subjectIds);
    }

    return this.findOne((teacher as any).id);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };

    const { rows, count } = await this.teacherModel.findAndCountAll({
      where,
      include: [{ model: SubjectModel, through: { attributes: [] } }],
      limit,
      offset: (page - 1) * limit,
      order: [['name', 'ASC']],
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const t = await this.teacherModel.findByPk(id, {
      include: [{ model: SubjectModel, through: { attributes: [] } }],
    });
    if (!t) throw new NotFoundException('Professor não encontrado');
    return t;
  }

  async update(id: string, dto: any) {
    const t = await this.findOne(id);
    const updateData: any = { ...dto };
    if (dto.registrationNumber) {
      updateData.registration = dto.registrationNumber;
      delete updateData.registrationNumber;
    }
    delete updateData.subjectIds;
    await (t as any).update(updateData);

    if (dto.subjectIds !== undefined) {
      await (t as any).$set('subjects', dto.subjectIds);
    }

    return this.findOne(id);
  }

  async findByUserId(userId: string) {
    const t = await this.teacherModel.findOne({
      where: { userId },
      include: [{ model: SubjectModel, through: { attributes: [] } }],
    });
    if (!t) throw new NotFoundException('Professor não encontrado');
    return t;
  }

  async remove(id: string) {
    await (await this.findOne(id)).destroy();
    return { message: 'Professor removido' };
  }
}
