import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { escapeLike } from '../../../../shared/utils/escape-like.util';
import { SubjectModel } from '../../infrastructure/database/models/subject.model';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(@InjectModel(SubjectModel) private subjectModel: typeof SubjectModel) {}

  create(dto: { name: string; code?: string; workload?: number }) {
    return this.subjectModel.create(dto as any);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 50, search } = pagination;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };

    const { rows, count } = await this.subjectModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const s = await this.subjectModel.findByPk(id);
    if (!s) throw new NotFoundException('Disciplina não encontrada');
    return s;
  }

  async update(id: string, dto: any) {
    const s = await this.findOne(id);
    await s.update(dto);
    return s;
  }

  async remove(id: string) {
    await (await this.findOne(id)).destroy();
    return { message: 'Disciplina removida' };
  }
}
